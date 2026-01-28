import { TrendingUp, CheckCircle, Rocket, Percent, Zap } from "lucide-react";

const stats = [
  { label: "Total Submitted", value: "12,847", icon: TrendingUp, sublabel: "all time" },
  { label: "Total Verified", value: "11,203", icon: CheckCircle, sublabel: "87.2% success" },
  { label: "Total Launched", value: "10,891", icon: Rocket, sublabel: "live tokens" },
  { label: "Success Rate", value: "87.2%", icon: Percent, sublabel: "verification" },
];

const todayStats = [
  { label: "Submitted Today", value: "342" },
  { label: "Verified Today", value: "298" },
  { label: "Launched Today", value: "287" },
];

export default function Stats() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">STATISTICS</h1>
        <p className="text-muted-foreground">Platform performance overview</p>
      </div>

      {/* Divider */}
      <div className="divider-red mb-8" />

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="pokemon-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="font-display text-4xl text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-primary mt-1">{stat.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Today's stats */}
      <div className="pokemon-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground">TODAY'S ACTIVITY</h2>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {todayStats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
