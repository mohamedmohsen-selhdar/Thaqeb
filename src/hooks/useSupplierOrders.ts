import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Tables } from "@/integrations/supabase/types";

export type SupplierOrder = Tables<"orders">;

export interface SupplierStats {
  activeJobs: number;
  thisMonthEarnings: number;
  qualityScore: number;
  onTimeRate: number;
}

export function useSupplierOrders() {
  const { user } = useAuth();

  const { data: supplier, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching supplier:", error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["supplier-orders", supplier?.id],
    queryFn: async () => {
      if (!supplier?.id) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("supplier_id", supplier.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
      return data as SupplierOrder[];
    },
    enabled: !!supplier?.id,
  });

  // Calculate stats
  const stats: SupplierStats = {
    activeJobs: orders.filter((o) => 
      ["pending_review", "quoted", "in_production"].includes(o.status || "")
    ).length,
    thisMonthEarnings: orders
      .filter((o) => {
        const orderDate = new Date(o.created_at);
        const now = new Date();
        return (
          o.status === "completed" &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, o) => sum + (Number(o.final_price) || 0), 0),
    qualityScore: supplier?.quality_score ? Number(supplier.quality_score) : 0,
    onTimeRate: supplier?.on_time_rate ? Number(supplier.on_time_rate) : 0,
  };

  const activeOrders = orders.filter((o) =>
    ["pending_review", "quoted", "in_production"].includes(o.status || "")
  );

  const historyOrders = orders.filter((o) =>
    ["completed", "cancelled", "delivered"].includes(o.status || "")
  );

  return {
    supplier,
    orders,
    activeOrders,
    historyOrders,
    stats,
    isLoading: supplierLoading || ordersLoading,
  };
}
