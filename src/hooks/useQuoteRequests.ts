import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { Database, Json } from "@/integrations/supabase/types";

type ManufacturingProcess = Database["public"]["Enums"]["manufacturing_process"];

interface QuoteRequestData {
  title: string;
  description?: string;
  process?: string;
  material?: string;
  quantity?: number;
  notes?: string;
  file_urls?: string[];
  ai_analysis?: Json;
}

// Map UI process names to database enum values
const processMap: Record<string, ManufacturingProcess> = {
  "CNC Machining": "cnc_machining",
  "Sheet Metal": "sheet_metal",
  "3D Printing": "3d_printing",
  "Wire Cutting (EDM)": "cnc_machining",
  "Die Casting": "casting",
  "Galvanization": "other",
  "Milling": "cnc_machining",
  "Drilling": "cnc_machining",
  "Tube Cutting": "laser_cutting",
  "Injection Molding": "injection_molding",
  "Laser Cutting": "laser_cutting",
  "Welding": "welding",
};

export function useQuoteRequests() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cad-drawings")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { data: urlData } = supabase.storage
        .from("cad-drawings")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const submitQuoteRequest = async (
    data: QuoteRequestData,
    files: File[]
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: "You must be logged in to submit a quote request" };
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      let fileUrls: string[] = [];
      if (files.length > 0) {
        fileUrls = await uploadFiles(files);
      }

      // Map the process name to enum value
      const mappedProcess: ManufacturingProcess | null = data.process 
        ? (processMap[data.process] || "other") 
        : null;

      // Insert quote request
      const insertData = {
        client_id: user.id,
        title: data.title || "Untitled Quote Request",
        description: data.description || null,
        process: mappedProcess,
        material: data.material || null,
        quantity: data.quantity || 1,
        notes: data.notes || null,
        file_urls: fileUrls.length > 0 ? fileUrls : null,
        ai_analysis: data.ai_analysis || null,
        status: "pending_review" as const,
      };

      const { data: quoteRequest, error } = await supabase
        .from("quote_requests")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Error submitting quote request:", error);
        return { success: false, error: error.message };
      }

      toast.success("Quote request submitted successfully!");
      return { success: true, id: quoteRequest.id };
    } catch (error) {
      console.error("Error in submitQuoteRequest:", error);
      return { success: false, error: (error as Error).message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuoteRequest,
    isSubmitting,
  };
}
