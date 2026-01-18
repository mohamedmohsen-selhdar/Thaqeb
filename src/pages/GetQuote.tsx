import { useState } from "react";
import { Link } from "react-router-dom";
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
  Shield
} from "lucide-react";

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
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request:", { files, ...formData });
    // TODO: Submit to backend
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Fabri<span className="text-primary">share</span>
            </span>
          </Link>

          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Upload Files" : s === 2 ? "Specifications" : "Contact Info"}
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
                          Upload Your Drawings
                        </h2>
                        <p className="text-muted-foreground">
                          Upload CAD files, technical drawings, or specifications
                        </p>
                      </div>

                      {/* File Upload Zone */}
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
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
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF, DXF, STEP, STL, IGES, DWG (max 50MB each)
                          </p>
                        </label>
                      </div>

                      {/* Uploaded Files */}
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
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

                      <Button
                        type="button"
                        variant="hero"
                        className="w-full"
                        onClick={() => setStep(2)}
                        disabled={files.length === 0}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          Specifications
                        </h2>
                        <p className="text-muted-foreground">
                          Tell us about your manufacturing requirements
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Manufacturing Process</Label>
                          <Select
                            value={formData.process}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, process: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select process" />
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
                          <Label>Material</Label>
                          <Select
                            value={formData.material}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, material: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
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
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="e.g., 100"
                            value={formData.quantity}
                            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline">Desired Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special requirements, tolerances, finishes, etc."
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
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="hero"
                          className="flex-1"
                          onClick={() => setStep(3)}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          Contact Information
                        </h2>
                        <p className="text-muted-foreground">
                          Where should we send your quote?
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            placeholder="Your company name"
                            value={formData.companyName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+20 123 456 7890"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button type="submit" variant="hero" className="flex-1">
                          Submit Quote Request
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  What Happens Next?
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, text: "Receive detailed quote within 48 hours" },
                    { icon: Shield, text: "Review and approve quote at no obligation" },
                    { icon: Factory, text: "Production begins after your approval" },
                  ].map((item) => (
                    <div key={item.text} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
                <p className="text-sm text-foreground mb-2 font-medium">
                  Need help?
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is ready to assist you with your quote request.
                </p>
                <Button variant="outline-primary" size="sm" className="w-full">
                  Contact Support
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
