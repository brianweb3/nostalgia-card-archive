import { TrendingUp, CheckCircle, Rocket, Percent } from "lucide-react";

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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Stats</h1>
        <p className="text-sm text-muted-foreground">Platform statistics overview</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="text-xs text-muted-foreground/70 mt-1">{stat.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Today's stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Today</h2>
        <div className="grid grid-cols-3 gap-6">
          {todayStats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
