import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupplierRegistrationData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone: string;
  capabilities?: string[];
}

export function useSupplierRegistration() {
  const [isRegistering, setIsRegistering] = useState(false);

  const registerSupplier = async (
    data: SupplierRegistrationData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsRegistering(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.fullName,
            company_name: data.companyName,
            phone: data.phone,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user account" };
      }

      // Wait a moment for the trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Update user role to supplier using secure RPC function
      const { data: roleUpdated, error: roleError } = await supabase.rpc('register_as_supplier');

      if (roleError || !roleUpdated) {
        console.error("Role update error:", roleError);
        return { success: false, error: "Failed to update role to supplier. Please contact support." };
      }

      // 3. Create supplier record
      const { error: supplierError } = await supabase.from("suppliers").insert({
        user_id: authData.user.id,
        company_name: data.companyName,
        contact_email: data.email,
        contact_phone: data.phone,
        capabilities: [],
        is_active: true,
      });

      if (supplierError) {
        console.error("Supplier creation error:", supplierError);
        // Don't fail the registration, they can complete profile later
      }

      // 4. Update profile with company info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          company_name: data.companyName,
          phone: data.phone,
        })
        .eq("user_id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      toast.success("Account created successfully! Welcome to Thaqeb.");
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: (error as Error).message };
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerSupplier,
    isRegistering,
  };
}
