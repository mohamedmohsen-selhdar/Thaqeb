import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Finalizing authentication...");

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthChange = async () => {
      // Set up a listener for auth state changes (this catches the session update from the hash)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await processSession(session);
        } else if (event === 'SIGNED_OUT') {
          // If we get a signed out event on this page, it might mean auth failed or user is just arriving
          // We can't assume failure immediately, but if we don't get 'SIGNED_IN' soon, the timeout will catch it.
        }
      });

      // Also try to get the session immediately in case it's already established
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session get error:", error);
        toast.error("Authentication error: " + error.message);
        navigate("/login");
        return;
      }

      if (session) {
        await processSession(session);
      } else {
        // Fallback: Check if there's an error in the URL hash
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
          const params = new URLSearchParams(hash.substring(1)); // remove #
          const errorDescription = params.get('error_description');
          toast.error(errorDescription || "Authentication failed");
          navigate("/login");
        }
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    handleAuthChange();

    // Safety timeout - if nothing happens after 5 seconds, redirect
    const timeout = setTimeout(() => {
      navigate("/login");
      toast.error("Authentication timed out. Please try again.");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const processSession = async (session: any) => {
    setStatus("Setting up your account...");
    const user = session.user;

    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has an intended role from registration (stored before OAuth redirect)
    const intendedRole = localStorage.getItem("thaqeb_intended_role");
    localStorage.removeItem("thaqeb_intended_role");

    try {
      if (intendedRole === "supplier") {
        // Supplier Setup
        setStatus("Creating supplier profile...");

        // Check if already is a supplier to avoid errors
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (existingRole?.role !== 'supplier') {
          // Call RPC to update role
          const { error: roleError } = await supabase.rpc('register_as_supplier');
          if (roleError) {
            console.error("Error setting role:", roleError);
            // Allow continuing even if this fails, might handle manually
          }
        }

        // Create/Check supplier profile
        const { error: profileError } = await supabase
          .from("suppliers")
          .insert({
            user_id: user.id,
            company_name: user.user_metadata?.full_name || "New Workshop",
            contact_email: user.email || "",
            is_active: true,
          });

        if (profileError && profileError.code !== "23505") { // 23505 is unique violation (already exists)
          console.error("Supplier profile error:", profileError);
        }

        toast.success("Welcome to Thaqeb!");
        navigate("/supplier/dashboard");

      } else if (intendedRole === "client") {
        // Client Setup (Default)
        toast.success("Welcome to Thaqeb!");
        navigate("/client/dashboard");

      } else {
        // Generic Login (Role detection)
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError || !roleData) {
          // Default to client
          navigate("/client/dashboard");
        } else {
          switch (roleData.role) {
            case "supplier": navigate("/supplier/dashboard"); break;
            case "internal_ops":
            case "admin": navigate("/admin/dashboard"); break;
            case "client":
            default: navigate("/client/dashboard"); break;
          }
        }
      }
    } catch (error) {
      console.error("Auth process error:", error);
      navigate("/client/dashboard"); // Fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
};

export default AuthCallback;
