import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Authentication failed");
          navigate("/login");
          return;
        }

        if (!session?.user) {
          toast.error("No user session found");
          navigate("/login");
          return;
        }

        setStatus("Setting up your account...");

        // Check if user has an intended role from registration
        const intendedRole = localStorage.getItem("fabrishare_intended_role");
        localStorage.removeItem("fabrishare_intended_role");

        if (intendedRole === "supplier") {
          // Handle supplier registration for OAuth users
          setStatus("Creating supplier profile...");
          
          // Update role to supplier
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: "supplier" })
            .eq("user_id", session.user.id);

          if (roleError) {
            console.error("Error updating role:", roleError);
            // Continue anyway, role might be default
          }

          // Create supplier record
          const { error: supplierError } = await supabase
            .from("suppliers")
            .insert({
              user_id: session.user.id,
              company_name: session.user.user_metadata?.full_name || "New Workshop",
              contact_email: session.user.email || "",
              is_active: true,
            });

          if (supplierError && supplierError.code !== "23505") {
            // Ignore duplicate key errors
            console.error("Error creating supplier:", supplierError);
          }

          toast.success("Welcome to Fabrishare! Please complete your workshop profile.");
          navigate("/supplier/dashboard");
        } else {
          // Default client flow
          // Check existing role
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          const userRole = roleData?.role;

          toast.success("Welcome to Fabrishare!");

          // Redirect based on role
          if (userRole === "supplier") {
            navigate("/supplier/dashboard");
          } else if (userRole === "internal_ops" || userRole === "admin") {
            navigate("/operations");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Something went wrong during authentication");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
};

export default AuthCallback;
