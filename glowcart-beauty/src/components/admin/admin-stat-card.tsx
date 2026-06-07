import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
};

const trendColors = {
  up: "text-emerald-600",
  down: "text-destructive",
  neutral: "text-muted-foreground",
} as const;

export function AdminStatCard({
  label,
  value,
  change,
  trend = "neutral",
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {change ? (
        <p className={cn("mt-1 text-xs font-medium", trendColors[trend])}>{change}</p>
      ) : null}
    </div>
  );
}
