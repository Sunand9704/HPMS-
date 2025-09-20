import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "success" | "warning";
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "primary" 
}: StatsCardProps) => {
  const variantStyles = {
    primary: "border-primary/20 bg-gradient-card",
    secondary: "border-secondary/20 bg-gradient-card", 
    success: "border-success/20 bg-gradient-card",
    warning: "border-warning/20 bg-gradient-card",
  };

  const iconStyles = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10", 
    warning: "text-warning bg-warning/10",
  };

  return (
    <Card className={cn("shadow-card hover:shadow-elevated transition-all duration-200", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                <span 
                  className={cn(
                    "text-sm font-medium",
                    change.type === "increase" ? "text-success" : "text-danger"
                  )}
                >
                  {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};