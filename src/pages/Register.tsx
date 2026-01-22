import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Factory, Mail, Lock, User, Building2, ArrowRight, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSupplierRegistration } from "@/hooks/useSupplierRegistration";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user, role, isLoading: authLoading } = useAuth();
  const { registerSupplier, isRegistering } = useSupplierRegistration();
  
  const [userType, setUserType] = useState<"client" | "supplier">("client");
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && role && !authLoading) {
      if (role === "supplier") {
        navigate("/supplier/dashboard");
      } else if (role === "internal_ops" || role === "admin") {
        navigate("/operations");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (userType === "supplier") {
      // Use supplier registration flow
      const result = await registerSupplier({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        companyName: formData.companyName,
        phone: formData.phone,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      navigate("/supplier/dashboard");
    } else {
      // Standard client registration
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        company_name: formData.companyName,
        phone: formData.phone,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSubmitting = isLoading || isRegistering;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-card border-r border-border items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-8">
            <Factory className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Join Egypt's Manufacturing Revolution
          </h2>
          <p className="text-muted-foreground mb-8">
            {userType === "supplier" 
              ? "Grow your workshop's business by connecting with clients who need quality manufacturing."
              : "Connect with certified workshops and get quality parts manufactured on demand."}
          </p>

          <div className="space-y-4">
            {userType === "supplier" ? (
              <>
                {[
                  "Access new client opportunities",
                  "Flexible capacity management",
                  "Secure payment processing",
                  "Quality rating system",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 group cursor-default">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground transition-colors duration-300 group-hover:text-primary">{benefit}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  "Access to 100+ certified workshops",
                  "Quality-assured manufacturing",
                  "Real-time order tracking",
                  "48-hour quote turnaround",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 group cursor-default">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground transition-colors duration-300 group-hover:text-primary">{benefit}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Fabri<span className="text-primary">share</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Create an account
          </h1>
          <p className="text-muted-foreground mb-8">
            Get started with Fabrishare today
          </p>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setUserType("client")}
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                userType === "client"
                  ? "bg-card text-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              I need parts
            </button>
            <button
              type="button"
              onClick={() => setUserType("supplier")}
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                userType === "supplier"
                  ? "bg-card text-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              I'm a workshop
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Ahmed Hassan"
                    value={formData.fullName}
                    onChange={handleChange("fullName")}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">
                  {userType === "supplier" ? "Workshop Name" : "Company Name"}
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder={userType === "supplier" ? "ABC Workshop" : "ABC Industries"}
                    value={formData.companyName}
                    onChange={handleChange("companyName")}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+20 123 456 7890"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  className="pl-10"
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full group" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create {userType === "supplier" ? "Supplier" : ""} Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
