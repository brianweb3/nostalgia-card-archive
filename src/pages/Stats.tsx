import { TrendingUp, CheckCircle, Rocket, Percent, Zap, Activity } from "lucide-react";
import { StatCard, MiniStat } from "@/components/ui/StatCard";

export default function Stats() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl md:text-6xl text-foreground mb-2">STATISTICS</h1>
        <p className="text-muted-foreground">Platform performance overview</p>
      </div>

      {/* Divider */}
      <div className="divider-red mb-8" />

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          value={12847}
          label="Total Submitted"
          sublabel="all time"
        />
        <StatCard
          icon={CheckCircle}
          value={11203}
          label="Total Verified"
          sublabel="87.2% success"
        />
        <StatCard
          icon={Rocket}
          value={10891}
          label="Total Launched"
          sublabel="live tokens"
        />
        <StatCard
          icon={Percent}
          value={87.2}
          suffix="%"
          decimals={1}
          label="Success Rate"
          sublabel="verification"
        />
      </div>

      {/* Today's stats */}
      <div className="pokemon-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground">TODAY'S ACTIVITY</h2>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <MiniStat value={342} label="Submitted Today" />
          <MiniStat value={298} label="Verified Today" />
          <MiniStat value={287} label="Launched Today" />
        </div>
      </div>

      {/* Volume stats */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="pokemon-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Total Volume</span>
          </div>
          <div className="font-display text-5xl md:text-6xl text-foreground">
            $<span className="tabular-nums">4.2</span>M
          </div>
        </div>
        <div className="pokemon-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">24h Volume</span>
          </div>
          <div className="font-display text-5xl md:text-6xl text-foreground">
            $<span className="tabular-nums">182</span>K
          </div>
        </div>
      </div>
    </div>
  );
}
