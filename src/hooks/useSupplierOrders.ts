import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();

  const { data: supplier, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

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

  // Accept job mutation
  const acceptJobMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "in_production", production_start: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      // Add timeline entry
      await supabase.from("order_timeline").insert({
        order_id: orderId,
        status: "in_production",
        notes: "Job accepted by supplier",
        created_by: user?.id,
      });
    },
    onSuccess: () => {
      toast.success("Job accepted successfully");
      queryClient.invalidateQueries({ queryKey: ["supplier-orders"] });
    },
    onError: (error) => {
      console.error("Error accepting job:", error);
      toast.error("Failed to accept job");
    },
  });

  // Decline job mutation
  const declineJobMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "pending_review", supplier_id: null })
        .eq("id", orderId);

      if (error) throw error;

      // Add timeline entry
      await supabase.from("order_timeline").insert({
        order_id: orderId,
        status: "pending_review",
        notes: "Job declined by supplier - returning to review",
        created_by: user?.id,
      });
    },
    onSuccess: () => {
      toast.success("Job declined");
      queryClient.invalidateQueries({ queryKey: ["supplier-orders"] });
    },
    onError: (error) => {
      console.error("Error declining job:", error);
      toast.error("Failed to decline job");
    },
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
    acceptJob: acceptJobMutation.mutate,
    declineJob: declineJobMutation.mutate,
    isAccepting: acceptJobMutation.isPending,
    isDeclining: declineJobMutation.isPending,
  };
}
