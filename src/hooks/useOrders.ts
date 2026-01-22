import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type OrderStatus = 
  | "draft"
  | "pending_review"
  | "quoted"
  | "accepted"
  | "in_production"
  | "qa_review"
  | "completed"
  | "cancelled";

type ManufacturingProcess = 
  | "cnc_machining"
  | "sheet_metal"
  | "3d_printing"
  | "injection_molding"
  | "casting"
  | "laser_cutting"
  | "welding"
  | "other";

interface QuoteRequest {
  id: string;
  title: string;
  description: string | null;
  process: ManufacturingProcess | null;
  material: string | null;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

// Map database enum values to display names
export const processDisplayMap: Record<ManufacturingProcess, string> = {
  cnc_machining: "CNC Machining",
  sheet_metal: "Sheet Metal",
  "3d_printing": "3D Printing",
  injection_molding: "Injection Molding",
  casting: "Casting",
  laser_cutting: "Laser Cutting",
  welding: "Welding",
  other: "Other",
};

export const statusDisplayMap: Record<OrderStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted/50 text-muted-foreground border-muted" },
  pending_review: { label: "Pending Review", color: "bg-warning/20 text-warning border-warning/30" },
  quoted: { label: "Quoted", color: "bg-info/20 text-info border-info/30" },
  accepted: { label: "Accepted", color: "bg-success/20 text-success border-success/30" },
  in_production: { label: "In Production", color: "bg-primary/20 text-primary border-primary/30" },
  qa_review: { label: "QA Review", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  completed: { label: "Completed", color: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function useClientQuoteRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["quote-requests", user?.id],
    queryFn: async (): Promise<QuoteRequest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quote requests:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function useClientOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}
