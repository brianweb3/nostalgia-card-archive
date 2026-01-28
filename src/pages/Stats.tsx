import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Rocket, Percent, Zap, Activity } from "lucide-react";
import { StatCard, MiniStat } from "@/components/ui/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalSubmitted: number;
  totalVerified: number;
  totalLaunched: number;
  totalRejected: number;
  successRate: number;
  todaySubmitted: number;
  todayVerified: number;
  todayLaunched: number;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get all verifications
      const { data: verifications, error: verError } = await supabase
        .from('verifications')
        .select('*');

      // Get all tokens
      const { data: tokens, error: tokError } = await supabase
        .from('tokens')
        .select('*');

      if (verError) throw verError;
      if (tokError) throw tokError;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate stats from real data
      const totalSubmitted = verifications?.length || 0;
      
      const verifiedItems = verifications?.filter(v => {
        const meta = v.metadata as { status?: string } | null;
        return meta?.status === 'verified' || (v.ai_confidence && v.ai_confidence >= 70);
      }) || [];
      const totalVerified = verifiedItems.length;

      const rejectedItems = verifications?.filter(v => {
        const meta = v.metadata as { status?: string } | null;
        return meta?.status === 'rejected' || (v.verified_at && v.ai_confidence && v.ai_confidence < 70);
      }) || [];
      const totalRejected = rejectedItems.length;

      const launchedTokens = tokens?.filter(t => t.status === 'launched') || [];
      const totalLaunched = launchedTokens.length;

      const successRate = totalSubmitted > 0 ? (totalVerified / totalSubmitted) * 100 : 0;

      // Today's stats
      const todayVerifications = verifications?.filter(v => {
        const createdAt = new Date(v.created_at);
        return createdAt >= today;
      }) || [];

      const todaySubmitted = todayVerifications.length;
      
      const todayVerified = todayVerifications.filter(v => {
        const meta = v.metadata as { status?: string } | null;
        return meta?.status === 'verified' || (v.ai_confidence && v.ai_confidence >= 70);
      }).length;

      const todayLaunched = tokens?.filter(t => {
        const createdAt = new Date(t.created_at);
        return createdAt >= today && t.status === 'launched';
      }).length || 0;

      setStats({
        totalSubmitted,
        totalVerified,
        totalLaunched,
        totalRejected,
        successRate,
        todaySubmitted,
        todayVerified,
        todayLaunched,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-2">STATISTICS</h1>
          <p className="text-muted-foreground">Platform performance overview</p>
        </div>
        <div className="divider-red mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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
          value={stats?.totalSubmitted || 0}
          label="Total Submitted"
          sublabel="all time"
        />
        <StatCard
          icon={CheckCircle}
          value={stats?.totalVerified || 0}
          label="Total Verified"
          sublabel={`${stats?.successRate.toFixed(1) || 0}% success`}
        />
        <StatCard
          icon={Rocket}
          value={stats?.totalLaunched || 0}
          label="Total Launched"
          sublabel="live tokens"
        />
        <StatCard
          icon={Percent}
          value={stats?.successRate || 0}
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
          <MiniStat value={stats?.todaySubmitted || 0} label="Submitted Today" />
          <MiniStat value={stats?.todayVerified || 0} label="Verified Today" />
          <MiniStat value={stats?.todayLaunched || 0} label="Launched Today" />
        </div>
      </div>

      {/* Empty state message */}
      {stats && stats.totalSubmitted === 0 && (
        <div className="mt-8 text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No verifications yet. Be the first to submit a card!
          </p>
        </div>
      )}
    </div>
  );
}
