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

        // Check if user has an intended role from registration (stored before OAuth redirect)
        const intendedRole = localStorage.getItem("fabrishare_intended_role");
        localStorage.removeItem("fabrishare_intended_role");

        // Wait for trigger to create profile/role records
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (intendedRole === "supplier") {
          // New supplier registration via OAuth
          setStatus("Creating supplier profile...");
          
          // Update role to supplier (cannot be changed later)
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: "supplier" })
            .eq("user_id", session.user.id);

          if (roleError) {
            console.error("Error updating role:", roleError);
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
            console.error("Error creating supplier:", supplierError);
          }

          toast.success("Welcome to Fabrishare! Please complete your workshop profile.");
          navigate("/supplier/dashboard");
        } else if (intendedRole === "client") {
          // New client registration via OAuth - role is already 'client' by default
          toast.success("Welcome to Fabrishare!");
          navigate("/client/dashboard");
        } else {
          // Existing user login via OAuth - check their role and redirect accordingly
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (roleError) {
            console.error("Error fetching role:", roleError);
            // Default to client if role fetch fails
            navigate("/client/dashboard");
            return;
          }

          const userRole = roleData?.role;
          toast.success("Welcome back!");

          // Redirect based on existing role
          switch (userRole) {
            case "supplier":
              navigate("/supplier/dashboard");
              break;
            case "internal_ops":
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "client":
            default:
              navigate("/client/dashboard");
              break;
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
