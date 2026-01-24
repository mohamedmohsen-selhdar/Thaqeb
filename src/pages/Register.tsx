import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Factory, Mail, Lock, User, Building2, ArrowRight, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSupplierRegistration } from "@/hooks/useSupplierRegistration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardForRole } from "@/components/ProtectedRoute";

type UserType = "client" | "supplier";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user, role, isLoading: authLoading } = useAuth();
  const { registerSupplier, isRegistering } = useSupplierRegistration();
  
  // Step 1: Role selection, Step 2: Registration form
  const [step, setStep] = useState<1 | 2>(1);
  
  // Get role from URL param if coming from landing page CTAs
  const roleFromUrl = searchParams.get("role") as UserType | null;
  const [selectedRole, setSelectedRole] = useState<UserType | null>(
    roleFromUrl === "supplier" ? "supplier" : roleFromUrl === "client" ? "client" : null
  );
  
  // If role is in URL, skip to step 2
  useEffect(() => {
    if (roleFromUrl === "supplier" || roleFromUrl === "client") {
      setSelectedRole(roleFromUrl);
      setStep(2);
    }
  }, [roleFromUrl]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && role && !authLoading) {
      navigate(getDashboardForRole(role));
    }
  }, [user, role, authLoading, navigate]);

  const handleRoleSelect = (role: UserType) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);

    if (selectedRole === "supplier") {
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
      navigate("/client/dashboard");
    }

    setIsLoading(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return;
    
    setIsGoogleLoading(true);
    try {
      // Store the intended role in localStorage for post-OAuth handling
      localStorage.setItem("fabrishare_intended_role", selectedRole);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        localStorage.removeItem("fabrishare_intended_role");
      }
    } catch (error) {
      toast.error("Failed to initiate Google sign-up");
      localStorage.removeItem("fabrishare_intended_role");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSubmitting = isLoading || isRegistering || isGoogleLoading;

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 justify-center group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Fabri<span className="text-primary">share</span>
            </span>
          </Link>

          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              How will you use Fabrishare?
            </h1>
            <p className="text-muted-foreground">
              Select your role to get started. This cannot be changed later.
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect("client")}
              className="w-full p-6 rounded-xl border-2 border-border bg-card text-left transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    I Need Parts Fabricated
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Submit quote requests, track orders, and get quality parts manufactured.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("supplier")}
              className="w-full p-6 rounded-xl border-2 border-border bg-card text-left transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    I Own a Workshop
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Manage your machines, receive job requests, and grow your business.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
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
            {selectedRole === "supplier" 
              ? "Grow your workshop's business by connecting with clients who need quality manufacturing."
              : "Connect with certified workshops and get quality parts manufactured on demand."}
          </p>

          <div className="space-y-4">
            {selectedRole === "supplier" ? (
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
          {/* Back Button */}
          {!roleFromUrl && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Change role
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Fabri<span className="text-primary">share</span>
            </span>
          </Link>

          {/* Role Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {selectedRole === "supplier" ? (
              <>
                <Factory className="h-4 w-4" />
                Registering as Workshop
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Registering as Client
              </>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-muted-foreground mb-8">
            Get started with Fabrishare today
          </p>

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
                  {selectedRole === "supplier" ? "Workshop Name" : "Company Name"}
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder={selectedRole === "supplier" ? "ABC Workshop" : "ABC Industries"}
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
              {isSubmitting && !isGoogleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={isSubmitting}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
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
