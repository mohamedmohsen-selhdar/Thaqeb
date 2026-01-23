import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Order = Tables<"orders">;
export type QuoteRequest = Tables<"quote_requests">;
export type Supplier = Tables<"suppliers">;

export interface OperationsStats {
  pending: number;
  inProgress: number;
  qaRequired: number;
  totalValue: number;
}

export function useOperationsData() {
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["operations-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
      return data as Order[];
    },
  });

  const { data: quoteRequests = [], isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ["operations-quote-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quote requests:", error);
        return [];
      }
      return data as QuoteRequest[];
    },
  });

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["operations-suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("is_active", true)
        .order("company_name", { ascending: true });

      if (error) {
        console.error("Error fetching suppliers:", error);
        return [];
      }
      return data as Supplier[];
    },
  });

  // Calculate stats from both orders and quote requests
  const stats: OperationsStats = {
    pending: orders.filter((o) => 
      ["pending_review", "draft"].includes(o.status || "")
    ).length + quoteRequests.filter((q) => 
      ["draft", "pending_review"].includes(q.status || "")
    ).length,
    inProgress: orders.filter((o) => 
      ["quoted", "in_production"].includes(o.status || "")
    ).length,
    qaRequired: orders.filter((o) => o.status === "qa_review").length,
    totalValue: orders.reduce((sum, o) => sum + (Number(o.quoted_price) || 0), 0),
  };

  const refetchAll = () => {
    refetchOrders();
    refetchQuotes();
  };

  return {
    orders,
    quoteRequests,
    suppliers,
    stats,
    isLoading: ordersLoading || quotesLoading || suppliersLoading,
    refetch: refetchAll,
  };
}
