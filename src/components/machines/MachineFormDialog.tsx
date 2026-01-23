import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { machineTypeLabels } from "@/hooks/useMachines";
import type { Database } from "@/integrations/supabase/types";

type Machine = Database["public"]["Tables"]["machines"]["Row"];
type MachineType = Database["public"]["Enums"]["machine_type"];

const machineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  machine_type: z.enum([
    "cnc_milling",
    "cnc_lathe",
    "laser_cutting",
    "plasma_cutting",
    "bending",
    "wire_cutting",
    "die_casting",
    "metal_3d_printing",
    "welding",
    "surface_finishing",
    "other",
  ]),
  xyz_capacity: z.string().max(100).optional(),
  table_size: z.string().max(100).optional(),
  accuracy: z.string().max(100).optional(),
  tonnage: z.coerce.number().min(0).optional(),
  available_hours_per_day: z.coerce.number().min(1).max(24).default(8),
  idle_capacity_percent: z.coerce.number().min(0).max(100).default(0),
  capacity_description: z.string().max(500).optional(),
});

type MachineFormData = z.infer<typeof machineSchema>;

interface MachineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine?: Machine | null;
  onSubmit: (data: MachineFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const MachineFormDialog = ({
  open,
  onOpenChange,
  machine,
  onSubmit,
  isSubmitting,
}: MachineFormDialogProps) => {
  const isEditing = !!machine;

  const form = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      name: "",
      machine_type: "cnc_milling",
      xyz_capacity: "",
      table_size: "",
      accuracy: "",
      tonnage: undefined,
      available_hours_per_day: 8,
      idle_capacity_percent: 0,
      capacity_description: "",
    },
  });

  useEffect(() => {
    if (machine) {
      form.reset({
        name: machine.name,
        machine_type: machine.machine_type,
        xyz_capacity: machine.xyz_capacity || "",
        table_size: machine.table_size || "",
        accuracy: machine.accuracy || "",
        tonnage: machine.tonnage || undefined,
        available_hours_per_day: machine.available_hours_per_day || 8,
        idle_capacity_percent: machine.idle_capacity_percent || 0,
        capacity_description: machine.capacity_description || "",
      });
    } else {
      form.reset({
        name: "",
        machine_type: "cnc_milling",
        xyz_capacity: "",
        table_size: "",
        accuracy: "",
        tonnage: undefined,
        available_hours_per_day: 8,
        idle_capacity_percent: 0,
        capacity_description: "",
      });
    }
  }, [machine, form]);

  const handleSubmit = async (data: MachineFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Machine" : "Add New Machine"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your machine details and capacity."
              : "Add a new machine to your workshop inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Haas VF-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="machine_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select machine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(machineTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="xyz_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XYZ Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500x400x300mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="table_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 600x400mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accuracy</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ±0.01mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tonnage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tonnage (if applicable)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="available_hours_per_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Hours per Day: {field.value}h</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={24}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    How many hours per day is this machine available for work?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idle_capacity_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Current Idle Capacity: {field.value}%
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    What percentage of this machine's capacity is currently
                    available for new jobs?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {isEditing ? "Update Machine" : "Add Machine"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
