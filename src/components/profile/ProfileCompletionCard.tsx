import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileField {
  label: string;
  completed: boolean;
}

interface ProfileCompletionCardProps {
  fields: ProfileField[];
  onComplete: () => void;
  title?: string;
}

export const ProfileCompletionCard = ({
  fields,
  onComplete,
  title = "Complete Your Profile",
}: ProfileCompletionCardProps) => {
  const completedCount = fields.filter((f) => f.completed).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;

  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-6 transition-all duration-300",
        isComplete
          ? "border-success/30 bg-success/5"
          : "border-warning/30 bg-warning/5"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning" />
            )}
            <h3 className="font-display font-semibold text-foreground">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {isComplete
              ? "Your profile is complete!"
              : `Complete your profile to ${
                  title.includes("Workshop") ? "receive job requests" : "submit orders"
                }`}
          </p>
        </div>
        <span
          className={cn(
            "text-2xl font-bold",
            isComplete ? "text-success" : "text-warning"
          )}
        >
          {percentage}%
        </span>
      </div>

      <Progress
        value={percentage}
        className={cn(
          "h-2 mb-4",
          isComplete ? "[&>div]:bg-success" : "[&>div]:bg-warning"
        )}
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            {field.completed ? (
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span
              className={cn(
                field.completed ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {field.label}
            </span>
          </div>
        ))}
      </div>

      {!isComplete && (
        <Button variant="hero" className="w-full" onClick={onComplete}>
          Complete Profile
        </Button>
      )}
    </div>
  );
};
