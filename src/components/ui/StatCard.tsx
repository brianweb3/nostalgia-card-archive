import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  sublabel?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: StatCardProps) {
  return (
    <div className={cn("pokemon-card p-6 group", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="space-y-1">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-4xl md:text-5xl text-foreground block"
        />
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
        {sublabel && (
          <div className="text-xs text-primary">{sublabel}</div>
        )}
      </div>
    </div>
  );
}

interface MiniStatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MiniStat({ value, label, prefix = "", suffix = "", className }: MiniStatProps) {
  return (
    <div className={cn("", className)}>
      <AnimatedCounter
        value={value}
        prefix={prefix}
        suffix={suffix}
        className="text-4xl md:text-5xl text-foreground block"
      />
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
