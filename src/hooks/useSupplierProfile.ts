import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

export const useSupplierProfile = () => {
  const { user } = useAuth();

  const supplierQuery = useQuery({
    queryKey: ["supplier", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No supplier record found
          return null;
        }
        throw error;
      }
      return data as Supplier;
    },
    enabled: !!user?.id,
  });

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    const supplier = supplierQuery.data;
    if (!supplier) return { percentage: 0, fields: [] };

    const fields = [
      { label: "Company Name", completed: !!supplier.company_name },
      { label: "Address", completed: !!supplier.address },
      { label: "Years Experience", completed: (supplier.years_experience || 0) > 0 },
      { label: "Payment Preference", completed: !!supplier.payment_preference },
      { label: "Operating Hours", completed: !!supplier.operating_hours_start },
      { label: "Capabilities", completed: (supplier.capabilities?.length || 0) > 0 },
      { label: "Specialties", completed: (supplier.specialties?.length || 0) > 0 },
      { label: "Phone Number", completed: !!supplier.contact_phone },
    ];

    const completedCount = fields.filter((f) => f.completed).length;
    return {
      percentage: Math.round((completedCount / fields.length) * 100),
      fields,
    };
  };

  return {
    supplier: supplierQuery.data,
    isLoading: supplierQuery.isLoading,
    error: supplierQuery.error,
    refetch: supplierQuery.refetch,
    profileCompletion: getProfileCompletion(),
  };
};
