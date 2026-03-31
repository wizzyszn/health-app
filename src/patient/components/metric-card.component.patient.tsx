import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: number;
  trend: string;
  trendDir: "up" | "down";
  icon: LucideIcon;
  gradient: string;
  bgLight: string;
  textAccent: string;
}

export function MetricCard({
  label,
  value,
  trend,
  trendDir,
  icon: Icon,
  gradient,
  bgLight,
  textAccent,
}: MetricCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">
      {/* gradient accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />

      <CardContent className="p-5 pt-6">
        <div className="flex items-start justify-between">
          {/* left: number + label */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                trendDir === "up" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trendDir === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {trend}
              <span className="text-muted-foreground font-normal">
                vs last month
              </span>
            </span>
          </div>

          {/* right: icon */}
          <div
            className={`${bgLight} rounded-xl p-3 transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`size-6 ${textAccent}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
