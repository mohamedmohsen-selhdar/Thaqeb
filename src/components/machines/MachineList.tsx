import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Cog } from "lucide-react";
import { MachineCard } from "./MachineCard";
import { MachineFormDialog } from "./MachineFormDialog";
import { useMachines } from "@/hooks/useMachines";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";

type Machine = Database["public"]["Tables"]["machines"]["Row"];

interface MachineListProps {
  supplierId: string | undefined;
}

export const MachineList = ({ supplierId }: MachineListProps) => {
  const {
    machines,
    isLoading,
    addMachine,
    updateMachine,
    deleteMachine,
    toggleMachineActive,
  } = useMachines(supplierId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [deletingMachineId, setDeletingMachineId] = useState<string | null>(null);

  const handleAddMachine = async (data: any) => {
    await addMachine.mutateAsync(data);
  };

  const handleUpdateMachine = async (data: any) => {
    if (!editingMachine) return;
    await updateMachine.mutateAsync({ id: editingMachine.id, ...data });
    setEditingMachine(null);
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setIsFormOpen(true);
  };

  const handleDelete = (machineId: string) => {
    setDeletingMachineId(machineId);
  };

  const confirmDelete = async () => {
    if (deletingMachineId) {
      await deleteMachine.mutateAsync(deletingMachineId);
      setDeletingMachineId(null);
    }
  };

  const handleToggleActive = async (machineId: string, isActive: boolean) => {
    await toggleMachineActive.mutateAsync({ id: machineId, is_active: isActive });
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingMachine(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Workshop Machines
          </h2>
          <p className="text-sm text-muted-foreground">
            {machines.length} machine{machines.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button variant="hero" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Machine
        </Button>
      </div>

      {machines.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No machines added yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Add your workshop machines to start receiving job requests
          </p>
          <Button variant="hero" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Your First Machine
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <MachineFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        machine={editingMachine}
        onSubmit={editingMachine ? handleUpdateMachine : handleAddMachine}
        isSubmitting={addMachine.isPending || updateMachine.isPending}
      />

      <AlertDialog
        open={!!deletingMachineId}
        onOpenChange={() => setDeletingMachineId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Machine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this machine? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
