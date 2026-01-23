import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Machine = Database["public"]["Tables"]["machines"]["Row"];
type MachineInsert = Database["public"]["Tables"]["machines"]["Insert"];
type MachineUpdate = Database["public"]["Tables"]["machines"]["Update"];
type MachineType = Database["public"]["Enums"]["machine_type"];

export const machineTypeLabels: Record<MachineType, string> = {
  cnc_milling: "CNC Milling",
  cnc_lathe: "CNC Lathe",
  laser_cutting: "Laser Cutting",
  plasma_cutting: "Plasma Cutting",
  bending: "Bending",
  wire_cutting: "Wire Cutting",
  die_casting: "Die Casting",
  metal_3d_printing: "Metal 3D Printing",
  welding: "Welding",
  surface_finishing: "Surface Finishing",
  other: "Other",
};

export const useMachines = (supplierId: string | undefined) => {
  const queryClient = useQueryClient();

  const machinesQuery = useQuery({
    queryKey: ["machines", supplierId],
    queryFn: async () => {
      if (!supplierId) return [];

      const { data, error } = await supabase
        .from("machines")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Machine[];
    },
    enabled: !!supplierId,
  });

  const addMachine = useMutation({
    mutationFn: async (machine: Omit<MachineInsert, "supplier_id">) => {
      if (!supplierId) throw new Error("Supplier ID not found");

      const { data, error } = await supabase
        .from("machines")
        .insert({
          ...machine,
          supplier_id: supplierId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines", supplierId] });
      toast.success("Machine added successfully!");
    },
    onError: (error) => {
      console.error("Error adding machine:", error);
      toast.error("Failed to add machine");
    },
  });

  const updateMachine = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: MachineUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("machines")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines", supplierId] });
      toast.success("Machine updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating machine:", error);
      toast.error("Failed to update machine");
    },
  });

  const deleteMachine = useMutation({
    mutationFn: async (machineId: string) => {
      const { error } = await supabase
        .from("machines")
        .delete()
        .eq("id", machineId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines", supplierId] });
      toast.success("Machine deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting machine:", error);
      toast.error("Failed to delete machine");
    },
  });

  const toggleMachineActive = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from("machines")
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines", supplierId] });
    },
  });

  return {
    machines: machinesQuery.data || [],
    isLoading: machinesQuery.isLoading,
    error: machinesQuery.error,
    addMachine,
    updateMachine,
    deleteMachine,
    toggleMachineActive,
  };
};
