import { useState, useEffect } from "react";
import { Filter, LayoutGrid, List, TrendingUp, Zap, Sparkles, DollarSign, Flame, Clock, User, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TokenDetailModal } from "@/components/TokenDetailModal";
import { supabase } from "@/integrations/supabase/client";

// Token interface
interface TokenData {
  id: string;
  name: string;
  ticker: string;
  creator?: string;
  time?: string;
  marketCap: string;
  progress?: number;
  change?: number | null;
  image: string;
  rarity?: string;
  description?: string;
  verifiedAt?: string;
  pumpfunUrl?: string;
}

const filterPills = [
  { id: "all", label: "ALL", icon: TrendingUp },
  { id: "live", label: "LIVE", icon: Zap, dot: true },
  { id: "new", label: "NEW", icon: Sparkles },
  { id: "marketcap", label: "MCAP", icon: DollarSign },
  { id: "trending", label: "HOT", icon: Flame },
  { id: "oldest", label: "OLD", icon: Clock },
];

const rarityColors: Record<string, string> = {
  common: "badge-common",
  uncommon: "badge-uncommon",
  rare: "badge-rare",
  ultra: "badge-ultra",
  legendary: "badge-legendary",
};

export default function LiveTokens() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("explore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tokens from database
  useEffect(() => {
    loadTokens();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('tokens-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tokens' },
        () => {
          loadTokens();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTokens: TokenData[] = (data || []).map(token => ({
        id: token.id,
        name: token.name,
        ticker: token.ticker,
        creator: token.wallet_address?.slice(0, 6) || 'Unknown',
        time: getTimeAgo(new Date(token.created_at)),
        marketCap: formatMarketCap(token.market_cap || 0),
        progress: token.progress || 0,
        change: null,
        image: token.image_url || '/placeholder.svg',
        rarity: token.rarity || 'common',
        description: token.description || '',
        verifiedAt: new Date(token.created_at).toLocaleString(),
        pumpfunUrl: `https://pump.fun/coin/${token.ticker?.toLowerCase()}`,
      }));

      setTokens(formattedTokens);
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenClick = (token: TokenData) => {
    setSelectedToken(token);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="content-box mb-6">
        <div className="header-bar">
          <span className="font-mono text-sm">LIVE TOKENS</span>
          <span className="font-mono text-sm">{tokens.length} TOTAL</span>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b-2 border-foreground">
          <button
            onClick={() => setActiveTab("explore")}
            className={cn(
              "px-6 py-3 font-mono text-sm uppercase transition-colors border-r-2 border-foreground",
              activeTab === "explore"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            EXPLORE
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "px-6 py-3 font-mono text-sm uppercase transition-colors",
              activeTab === "watchlist"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            WATCHLIST
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase whitespace-nowrap transition-all border-2 border-foreground",
                activeFilter === pill.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              )}
            >
              {pill.dot && <span className="w-2 h-2 bg-current animate-pulse" />}
              {pill.icon && <pill.icon className="w-3 h-3" />}
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-foreground">
            <button
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className={cn(
                "p-2 transition-colors border-l-2 border-foreground",
                viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="content-box flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-mono text-sm">LOADING TOKENS...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && tokens.length === 0 && (
        <div className="content-box flex flex-col items-center justify-center py-20 text-center">
          <PackageOpen className="w-20 h-20 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-2">NO TOKENS YET</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-md">
            Be the first to create a verified trading card token! Go to Create Token to get started.
          </p>
        </div>
      )}

      {/* Token Grid */}
      {!loading && tokens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.map((token, index) => (
            <div
              key={token.id}
              onClick={() => handleTokenClick(token)}
              className="content-box cursor-pointer transition-all duration-200 hover:border-primary animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3 p-4">
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0 border-2 border-foreground overflow-hidden">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-foreground truncate">{token.name}</h3>
                      <p className="font-mono text-xs text-primary">${token.ticker}</p>
                    </div>
                    <span className={cn("badge-rarity", rarityColors[token.rarity || "common"])}>
                      {token.rarity}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{token.creator}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{token.time}</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 border-t-2 border-foreground bg-muted/50 flex items-center justify-between">
                <span className="font-mono text-sm text-primary font-bold">
                  ${token.marketCap}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted border border-foreground overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${token.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {token.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Token Detail Modal */}
      <TokenDetailModal
        token={selectedToken}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

// Helper functions
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
  return `${Math.floor(seconds / 31536000)}y`;
}

function formatMarketCap(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}
