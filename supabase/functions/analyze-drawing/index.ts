import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResult {
  suggestedProcess: string;
  suggestedMaterial: string;
  dimensions: {
    length?: string;
    width?: string;
    height?: string;
    diameter?: string;
  };
  features: string[];
  tolerances: string[];
  surfaceFinish?: string;
  complexity: "low" | "medium" | "high";
  estimatedProductionTime?: string;
  notes: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const rawData = await req.json();

    // Validate and sanitize inputs to prevent prompt injection and malformed data
    const AnalyzeRequestSchema = z.object({
      fileName: z
        .string()
        .min(1, "File name is required")
        .max(255, "File name too long")
        .regex(/^[a-zA-Z0-9._\-\s]+$/, "File name contains invalid characters"),
      fileType: z.enum([
        "application/pdf",
        "image/vnd.dxf",
        "application/dxf",
        "model/step",
        "application/step",
        "model/stl",
        "application/stl",
        "model/iges",
        "application/iges",
        "application/acad",
        "application/octet-stream",
      ]),
      fileSize: z
        .number()
        .int()
        .min(1, "File size must be positive")
        .max(52428800, "File size exceeds 50MB limit"),
      fileContent: z.string().optional(),
    });

    const validationResult = AnalyzeRequestSchema.safeParse(rawData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { fileName, fileType, fileSize } = validationResult.data;
    // Sanitize fileName as defense-in-depth to prevent prompt injection
    const safeFileName = fileName.replace(/[\n\r]/g, " ").substring(0, 100);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the analysis prompt
    const systemPrompt = `You are an expert manufacturing engineer specializing in CAD drawing analysis. 
Your task is to analyze technical drawings and extract manufacturing specifications.

You must respond ONLY by calling the extract_specifications function with the extracted data.

Guidelines:
- Analyze file names for hints about the part (e.g., "bracket_v2.pdf" suggests a bracket)
- Consider file type when suggesting processes (PDFs often contain 2D drawings, STEP/STL are 3D models)
- For 3D files (STEP, STL, IGES), suggest CNC or 3D printing based on complexity
- For 2D files (PDF, DXF, DWG), consider sheet metal or wire cutting
- Default to common materials like Aluminum 6061 or Steel if uncertain
- List common features like holes, threads, chamfers, fillets
- Estimate complexity based on file size and type`;

    const userPrompt = `Analyze this CAD file and extract manufacturing specifications:

File Name: ${safeFileName}
File Type: ${fileType}
File Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB

Based on the file name and type, extract or intelligently estimate:
1. Recommended manufacturing process
2. Suggested material
3. Likely dimensions (if determinable from file name)
4. Common features for this type of part
5. Standard tolerances
6. Surface finish requirements
7. Complexity level
8. Estimated production time
9. Any important notes or considerations`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_specifications",
              description: "Extract manufacturing specifications from CAD drawing analysis",
              parameters: {
                type: "object",
                properties: {
                  suggestedProcess: {
                    type: "string",
                    enum: ["CNC Machining", "Sheet Metal", "3D Printing", "Wire Cutting (EDM)", "Die Casting", "Galvanization", "Milling", "Drilling", "Tube Cutting"],
                    description: "Recommended manufacturing process",
                  },
                  suggestedMaterial: {
                    type: "string",
                    enum: ["Aluminum 6061", "Aluminum 7075", "Steel 1018", "Steel 4140", "Stainless Steel 304", "Stainless Steel 316", "Brass C360", "Copper", "PLA", "ABS", "Nylon", "Other"],
                    description: "Suggested material for the part",
                  },
                  dimensions: {
                    type: "object",
                    properties: {
                      length: { type: "string", description: "Length dimension with units" },
                      width: { type: "string", description: "Width dimension with units" },
                      height: { type: "string", description: "Height dimension with units" },
                      diameter: { type: "string", description: "Diameter if applicable" },
                    },
                  },
                  features: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of identified features (holes, threads, chamfers, etc.)",
                  },
                  tolerances: {
                    type: "array",
                    items: { type: "string" },
                    description: "Standard tolerances for this type of part",
                  },
                  surfaceFinish: {
                    type: "string",
                    description: "Recommended surface finish",
                  },
                  complexity: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Part complexity level",
                  },
                  estimatedProductionTime: {
                    type: "string",
                    description: "Estimated production time range",
                  },
                  notes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Important notes or considerations",
                  },
                },
                required: ["suggestedProcess", "suggestedMaterial", "features", "complexity", "notes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_specifications" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze drawing");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function.name !== "extract_specifications") {
      throw new Error("Invalid response from AI");
    }

    const analysisResult: AnalysisResult = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, analysis: analysisResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error analyzing drawing:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze drawing" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});