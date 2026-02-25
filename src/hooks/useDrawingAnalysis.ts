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
      // MOCK AI ANALYSIS - Simulating a 3 second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      let mockAnalysis: AnalysisResult;

      const fileExt = file.name.split('.').pop()?.toLowerCase();

      if (fileExt === 'pdf') {
        mockAnalysis = {
          suggestedProcess: "Sheet Metal",
          suggestedMaterial: "Aluminum 6061",
          dimensions: {
            length: "150mm",
            width: "80mm",
            height: "2mm",
          },
          features: ["Bends", "Holes", "Laser Cut Profiles"],
          tolerances: ["±0.1mm general tolerance"],
          surfaceFinish: "Anodized Clear",
          complexity: "medium",
          estimatedProductionTime: "3-5 days",
          notes: ["Drawing indicates standard bend radii.", "Countersinks required on 4 mounting holes."]
        };
      } else {
        mockAnalysis = {
          suggestedProcess: "CNC Machining",
          suggestedMaterial: "Stainless Steel 304",
          dimensions: {
            length: "45mm",
            diameter: "20mm",
          },
          features: ["Turned profile", "Milled flats", "Internal threads"],
          tolerances: ["±0.05mm critical", "±0.1mm general"],
          surfaceFinish: "Machined finish",
          complexity: "high",
          estimatedProductionTime: "5-7 days",
          notes: ["Tight tolerances on inner diameter.", "Requires 5-axis machining for the milled flats."]
        };
      }

      setAnalysisResult(mockAnalysis);
      toast.success("Drawing analyzed successfully!");
      return mockAnalysis;
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