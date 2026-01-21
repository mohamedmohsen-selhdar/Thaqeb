import { AnalysisResult } from "@/hooks/useDrawingAnalysis";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Sparkles, 
  Cog, 
  Box, 
  Ruler, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Gauge
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIAnalysisCardProps {
  analysis: AnalysisResult;
  onApply: (analysis: AnalysisResult) => void;
  isRTL: boolean;
}

const complexityColors = {
  low: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-red-500/10 text-red-600 border-red-500/20",
};

const complexityLabels = {
  low: { en: "Low Complexity", ar: "تعقيد منخفض" },
  medium: { en: "Medium Complexity", ar: "تعقيد متوسط" },
  high: { en: "High Complexity", ar: "تعقيد عالي" },
};

export function AIAnalysisCard({ analysis, onApply, isRTL }: AIAnalysisCardProps) {
  const { language } = useLanguage();

  const labels = {
    title: language === "ar" ? "تحليل الذكاء الاصطناعي" : "AI Analysis",
    suggestedProcess: language === "ar" ? "العملية المقترحة" : "Suggested Process",
    suggestedMaterial: language === "ar" ? "المادة المقترحة" : "Suggested Material",
    dimensions: language === "ar" ? "الأبعاد" : "Dimensions",
    features: language === "ar" ? "الميزات المحددة" : "Identified Features",
    tolerances: language === "ar" ? "التفاوتات" : "Tolerances",
    surfaceFinish: language === "ar" ? "تشطيب السطح" : "Surface Finish",
    productionTime: language === "ar" ? "وقت الإنتاج المقدر" : "Est. Production Time",
    notes: language === "ar" ? "ملاحظات" : "Notes",
    applySpecs: language === "ar" ? "تطبيق المواصفات" : "Apply Specifications",
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 rounded-xl border border-primary/20 p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-foreground">
          {labels.title}
        </h3>
        <Badge className={complexityColors[analysis.complexity]}>
          {complexityLabels[analysis.complexity][language]}
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Process */}
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <Cog className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{labels.suggestedProcess}</p>
            <p className="text-sm font-medium text-foreground">{analysis.suggestedProcess}</p>
          </div>
        </div>

        {/* Material */}
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <Box className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{labels.suggestedMaterial}</p>
            <p className="text-sm font-medium text-foreground">{analysis.suggestedMaterial}</p>
          </div>
        </div>

        {/* Dimensions */}
        {analysis.dimensions && Object.values(analysis.dimensions).some(Boolean) && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{labels.dimensions}</p>
              <p className="text-sm font-medium text-foreground">
                {[
                  analysis.dimensions.length,
                  analysis.dimensions.width,
                  analysis.dimensions.height,
                  analysis.dimensions.diameter,
                ]
                  .filter(Boolean)
                  .join(" × ")}
              </p>
            </div>
          </div>
        )}

        {/* Production Time */}
        {analysis.estimatedProductionTime && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{labels.productionTime}</p>
              <p className="text-sm font-medium text-foreground">{analysis.estimatedProductionTime}</p>
            </div>
          </div>
        )}

        {/* Surface Finish */}
        {analysis.surfaceFinish && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{labels.surfaceFinish}</p>
              <p className="text-sm font-medium text-foreground">{analysis.surfaceFinish}</p>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      {analysis.features.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">{labels.features}</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.features.map((feature, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {analysis.notes.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{labels.notes}</p>
          </div>
          <ul className="text-xs text-foreground space-y-1">
            {analysis.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        variant="hero"
        size="sm"
        className="w-full"
        onClick={() => onApply(analysis)}
      >
        <Sparkles className="h-4 w-4" />
        {labels.applySpecs}
      </Button>
    </div>
  );
}