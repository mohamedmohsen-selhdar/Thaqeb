import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  Upload,
  FileText,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDrawingAnalysis, AnalysisResult } from "@/hooks/useDrawingAnalysis";
import { AIAnalysisCard } from "@/components/quote/AIAnalysisCard";
import { useAuth } from "@/hooks/useAuth";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { toast } from "sonner";

const processes = [
  "CNC Machining",
  "Sheet Metal",
  "3D Printing",
  "Wire Cutting (EDM)",
  "Die Casting",
  "Galvanization",
  "Milling",
  "Drilling",
  "Tube Cutting",
];

const materials = [
  "Aluminum 6061",
  "Aluminum 7075",
  "Steel 1018",
  "Steel 4140",
  "Stainless Steel 304",
  "Stainless Steel 316",
  "Brass C360",
  "Copper",
  "PLA",
  "ABS",
  "Nylon",
  "Other",
];

const GetQuote = () => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { submitQuoteRequest, isSubmitting } = useQuoteRequests();

  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    process: "",
    material: "",
    quantity: "",
    deadline: "",
    notes: "",
    companyName: "",
    email: "",
    phone: "",
    title: "",
  });

  const { isAnalyzing, analysisResult, analyzeDrawing, clearAnalysis } = useDrawingAnalysis();

  // Check if user is logged in when they reach step 3
  useEffect(() => {
    if (step === 3 && !user && !authLoading) {
      toast.info("Please sign in to submit your quote request");
      navigate("/login");
    }
  }, [step, user, authLoading, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      // Automatically analyze the first uploaded file
      if (newFiles.length > 0 && !analysisResult) {
        await analyzeDrawing(newFiles[0]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      clearAnalysis();
    }
  };

  const handleApplyAnalysis = (analysis: AnalysisResult) => {
    setFormData((prev) => ({
      ...prev,
      process: analysis.suggestedProcess,
      material: analysis.suggestedMaterial,
      notes: prev.notes
        ? `${prev.notes}\n\n${t.getQuote.additionalNotes}: ${analysis.notes.join(". ")}`
        : analysis.notes.join(". "),
    }));
    setStep(2);
  };

  const handleReanalyze = async () => {
    if (files.length > 0) {
      await analyzeDrawing(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit a quote request");
      navigate("/login");
      return;
    }

    // Generate a title from the first file name or process
    const title = formData.title ||
      (files.length > 0 ? files[0].name.replace(/\.[^/.]+$/, "") : formData.process) ||
      "Quote Request";

    const result = await submitQuoteRequest(
      {
        title,
        description: formData.notes,
        process: formData.process,
        material: formData.material,
        quantity: parseInt(formData.quantity) || 1,
        notes: formData.notes,
        ai_analysis: analysisResult ? JSON.parse(JSON.stringify(analysisResult)) : undefined,
      },
      files
    );

    if (result.success) {
      navigate("/client/dashboard");
    } else {
      toast.error(result.error || "Failed to submit quote request");
    }
  };

  const labels = {
    analyzeButton: isRTL ? "تحليل بالذكاء الاصطناعي" : "Analyze with AI",
    analyzing: isRTL ? "جاري التحليل..." : "Analyzing...",
    reanalyze: isRTL ? "إعادة التحليل" : "Re-analyze",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Tha<span className="text-primary">qeb</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  {isRTL ? "لوحة التحكم" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {isRTL ? "تسجيل الدخول" : "Sign In"}
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="ghost" size="sm">
                {isRTL ? <ArrowRight className="h-4 w-4 ml-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
                {t.common.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? t.getQuote.uploadFiles : s === 2 ? t.getQuote.specifications : t.getQuote.contactInfo}
                </span>
                {s < 3 && <div className="w-12 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-8">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          {t.getQuote.uploadTitle}
                        </h2>
                        <p className="text-muted-foreground">
                          {t.getQuote.uploadSubtitle}
                        </p>
                      </div>

                      {/* File Upload Zone */}
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          multiple
                          accept=".pdf,.dxf,.step,.stp,.stl,.iges,.dwg"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-4">
                            <Upload className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-foreground font-medium mb-1">
                            {t.getQuote.uploadHint}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t.getQuote.uploadFormats}
                          </p>
                        </label>
                      </div>

                      {/* Uploaded Files */}
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-surface-elevated hover:shadow-md group"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-background rounded"
                              >
                                <X className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Analysis Loading */}
                      {isAnalyzing && (
                        <div className="flex items-center justify-center gap-3 p-6 bg-primary/5 rounded-xl border border-primary/20">
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          <p className="text-sm text-foreground font-medium">{labels.analyzing}</p>
                        </div>
                      )}

                      {/* AI Analysis Result */}
                      {analysisResult && !isAnalyzing && (
                        <div className="space-y-3">
                          <AIAnalysisCard
                            analysis={analysisResult}
                            onApply={handleApplyAnalysis}
                            isRTL={isRTL}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleReanalyze}
                            className="w-full"
                          >
                            <Sparkles className="h-4 w-4" />
                            {labels.reanalyze}
                          </Button>
                        </div>
                      )}

                      {/* Analyze Button (if files exist but no analysis) */}
                      {files.length > 0 && !analysisResult && !isAnalyzing && (
                        <Button
                          type="button"
                          variant="outline-primary"
                          className="w-full"
                          onClick={() => analyzeDrawing(files[0])}
                        >
                          <Sparkles className="h-4 w-4" />
                          {labels.analyzeButton}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="hero"
                        className="w-full"
                        onClick={() => setStep(2)}
                        disabled={files.length === 0}
                      >
                        {t.common.continue}
                        {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          {t.getQuote.specsTitle}
                        </h2>
                        <p className="text-muted-foreground">
                          {t.getQuote.specsSubtitle}
                        </p>
                      </div>

                      {/* Title Field */}
                      <div className="space-y-2">
                        <Label htmlFor="title">{isRTL ? "عنوان الطلب" : "Request Title"}</Label>
                        <Input
                          id="title"
                          placeholder={isRTL ? "مثال: قطع ألومنيوم مخصصة" : "e.g., Custom Aluminum Parts"}
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.getQuote.manufacturingProcess}</Label>
                          <Select
                            value={formData.process}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, process: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t.getQuote.selectProcess} />
                            </SelectTrigger>
                            <SelectContent>
                              {processes.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>{t.getQuote.material}</Label>
                          <Select
                            value={formData.material}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, material: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t.getQuote.selectMaterial} />
                            </SelectTrigger>
                            <SelectContent>
                              {materials.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">{t.getQuote.quantity}</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder={t.getQuote.quantityPlaceholder}
                            value={formData.quantity}
                            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline">{t.getQuote.deadline}</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">{t.getQuote.additionalNotes}</Label>
                        <Textarea
                          id="notes"
                          placeholder={t.getQuote.notesPlaceholder}
                          value={formData.notes}
                          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                        >
                          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                          {t.common.back}
                        </Button>
                        <Button
                          type="button"
                          variant="hero"
                          className="flex-1"
                          onClick={() => setStep(3)}
                        >
                          {t.common.continue}
                          {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          {t.getQuote.contactTitle}
                        </h2>
                        <p className="text-muted-foreground">
                          {user
                            ? (isRTL ? "راجع طلبك وأرسله" : "Review your request and submit")
                            : t.getQuote.contactSubtitle}
                        </p>
                      </div>

                      {user ? (
                        /* Logged in - Show summary */
                        <div className="space-y-4">
                          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <h3 className="font-medium text-foreground">
                              {isRTL ? "ملخص الطلب" : "Request Summary"}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">{isRTL ? "العنوان:" : "Title:"}</span>
                                <p className="font-medium text-foreground">
                                  {formData.title || files[0]?.name || "Quote Request"}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t.getQuote.manufacturingProcess}:</span>
                                <p className="font-medium text-foreground">{formData.process || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t.getQuote.material}:</span>
                                <p className="font-medium text-foreground">{formData.material || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t.getQuote.quantity}:</span>
                                <p className="font-medium text-foreground">{formData.quantity || "1"}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{isRTL ? "الملفات:" : "Files:"}</span>
                                <p className="font-medium text-foreground">{files.length} file(s)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Not logged in - Prompt to sign in */
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            {isRTL
                              ? "يرجى تسجيل الدخول لإرسال طلب عرض السعر"
                              : "Please sign in to submit your quote request"}
                          </p>
                          <Link to="/login">
                            <Button variant="hero">
                              {isRTL ? "تسجيل الدخول" : "Sign In to Continue"}
                            </Button>
                          </Link>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                          {t.common.back}
                        </Button>
                        {user && (
                          <Button
                            type="submit"
                            variant="hero"
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {isRTL ? "جاري الإرسال..." : "Submitting..."}
                              </>
                            ) : (
                              <>
                                {t.getQuote.submitQuote}
                                {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  {t.getQuote.whatHappens}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, text: t.getQuote.receiveQuote },
                    { icon: Shield, text: t.getQuote.reviewQuote },
                    { icon: Factory, text: t.getQuote.productionBegins },
                  ].map((item) => (
                    <div key={item.text} className="flex gap-3 group cursor-default">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <p className="text-sm text-foreground mb-2 font-medium">
                  {t.getQuote.needHelp}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.getQuote.helpText}
                </p>
                <Button variant="outline-primary" size="sm" className="w-full">
                  {t.getQuote.contactSupport}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetQuote;
