import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Cog,
  Edit,
  Trash2,
  Clock,
  Gauge,
  Ruler,
} from "lucide-react";
import { machineTypeLabels } from "@/hooks/useMachines";
import type { Database } from "@/integrations/supabase/types";

type Machine = Database["public"]["Tables"]["machines"]["Row"];

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (machineId: string) => void;
  onToggleActive: (machineId: string, isActive: boolean) => void;
}

export const MachineCard = ({
  machine,
  onEdit,
  onDelete,
  onToggleActive,
}: MachineCardProps) => {
  const capacityUsed = 100 - (machine.idle_capacity_percent || 0);

  return (
    <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Cog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {machine.name}
            </h3>
            <Badge variant="outline" className="mt-1">
              {machineTypeLabels[machine.machine_type] || machine.machine_type}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={machine.is_active ?? true}
            onCheckedChange={(checked) => onToggleActive(machine.id, checked)}
          />
          <span className="text-xs text-muted-foreground">
            {machine.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {machine.xyz_capacity && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Capacity:</span>
            <span className="text-foreground">{machine.xyz_capacity}</span>
          </div>
        )}
        {machine.table_size && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Table Size:</span>
            <span className="text-foreground">{machine.table_size}</span>
          </div>
        )}
        {machine.accuracy && (
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Accuracy:</span>
            <span className="text-foreground">{machine.accuracy}</span>
          </div>
        )}
        {machine.tonnage && (
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tonnage:</span>
            <span className="text-foreground">{machine.tonnage} tons</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Available Hours:</span>
          <span className="text-foreground">
            {machine.available_hours_per_day || 8}h/day
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Capacity Utilization</span>
          <span className="text-foreground font-medium">{capacityUsed}% used</span>
        </div>
        <Progress value={capacityUsed} className="h-2" />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(machine)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(machine.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
