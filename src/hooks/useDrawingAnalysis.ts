import { useState } from "react";
import { toast } from "sonner";

export interface AnalysisResult {
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

export function useDrawingAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeDrawing = async (file: File): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-drawing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || getFileTypeFromExtension(file.name),
            fileSize: file.size,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          toast.error("AI credits exhausted. Please add funds to continue.");
        } else {
          toast.error(error.error || "Failed to analyze drawing");
        }
        return null;
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
      toast.success("Drawing analyzed successfully!");
      return data.analysis;
    } catch (error) {
      console.error("Error analyzing drawing:", error);
      toast.error("Failed to analyze drawing. Please try again.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  return {
    isAnalyzing,
    analysisResult,
    analyzeDrawing,
    clearAnalysis,
  };
}

function getFileTypeFromExtension(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    pdf: "application/pdf",
    dxf: "image/vnd.dxf",
    step: "model/step",
    stp: "model/step",
    stl: "model/stl",
    iges: "model/iges",
    igs: "model/iges",
    dwg: "application/acad",
  };
  return typeMap[ext || ""] || "application/octet-stream";
}