import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, LayoutGrid, List, Settings, TrendingUp, Zap, Sparkles, DollarSign, Flame, Clock, MessageSquare, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import monster images
import monsterFire from "@/assets/monster-fire.png";
import monsterWater from "@/assets/monster-water.png";
import monsterPlant from "@/assets/monster-plant.png";
import monsterElectric from "@/assets/monster-electric.png";
import monsterShadow from "@/assets/monster-shadow.png";
import monsterLegendary from "@/assets/monster-legendary.png";

// Trending tokens data
const trendingTokens = [
  { id: "1", name: "Charizard Holo", ticker: "CHAR", marketCap: "$3.56M", image: monsterFire, description: "1st Edition PSA 10 - The holy grail" },
  { id: "2", name: "Blastoise Prime", ticker: "BLAST", marketCap: "$8.10M", image: monsterWater, description: "Base Set Unlimited - Pristine condition" },
  { id: "3", name: "Venusaur 1st", ticker: "VENU", marketCap: "$968.35K", image: monsterPlant, description: "Shadowless 1st Edition - Rare find" },
  { id: "4", name: "Pikachu VMAX", ticker: "PIKA", marketCap: "$92.37M", image: monsterElectric, description: "Rainbow Rare - Fan favorite" },
  { id: "5", name: "Gengar Alt", ticker: "GENG", marketCap: "$983.93K", image: monsterShadow, description: "Alternate Art - Ghost power" },
  { id: "6", name: "Mew Gold Star", ticker: "MEW", marketCap: "$7.78M", image: monsterLegendary, description: "Gold Star Series - Legendary" },
];

// All tokens data
const allTokens = [
  { id: "1", name: "Satoshi", ticker: "SATO", creator: "HUgpmq", time: "2m", marketCap: "$3.5K", progress: 35, change: 12.5, image: monsterFire, rarity: "rare" },
  { id: "2", name: "Estcru LLC", ticker: "ESTC", creator: "7LL9li", time: "55m", marketCap: "$9.0K", progress: 65, change: -18.00, image: monsterWater, rarity: "uncommon" },
  { id: "3", name: "Steaks 500", ticker: "SNB", creator: "DQfd5M", time: "12m", marketCap: "$15.8K", progress: 45, change: -11.00, image: monsterPlant, rarity: "common" },
  { id: "4", name: "Bored Penguin", ticker: "BPYC", creator: "CqFYQU", time: "10m", marketCap: "$6.2K", progress: 25, change: 0.16, image: monsterShadow, rarity: "ultra" },
  { id: "5", name: "24/7 Trading", ticker: "HOOD", creator: "4jsHZ8", time: "59m", marketCap: "$243.2K", progress: 85, change: -36.24, image: monsterElectric, rarity: "rare" },
  { id: "6", name: "US Card", ticker: "USTP", creator: "DWPphp", time: "20m", marketCap: "$19.1K", progress: 55, change: -5.76, image: monsterLegendary, rarity: "legendary" },
  { id: "7", name: "Gold Silver", ticker: "PKMN", creator: "CTDMaY", time: "10h", marketCap: "$2.6M", progress: 90, change: -14.62, image: monsterFire, rarity: "rare" },
  { id: "8", name: "Digi Silver", ticker: "DIGI", creator: "9a8TA5", time: "4m", marketCap: "$4.6K", progress: 40, change: 13.15, image: monsterWater, rarity: "uncommon" },
  { id: "9", name: "Lumi", ticker: "LUMI", creator: "EiwjoW", time: "3h", marketCap: "$1.2K", progress: 15, change: null, image: monsterPlant, rarity: "common" },
  { id: "10", name: "Dog Town", ticker: "IDYL", creator: "ApNyqP", time: "9m", marketCap: "$8.4K", progress: 50, change: 8.2, image: monsterShadow, rarity: "rare" },
  { id: "11", name: "Ikea Monk", ticker: "MONK", creator: "9cscgf", time: "1y", marketCap: "$156K", progress: 75, change: null, image: monsterElectric, rarity: "ultra" },
  { id: "12", name: "Orangutan", ticker: "ORANG", creator: "4vNgQp", time: "6m", marketCap: "$2.1K", progress: 20, change: 5.5, image: monsterLegendary, rarity: "legendary" },
];

const filterPills = [
  { id: "movers", label: "Movers", icon: TrendingUp, active: true },
  { id: "live", label: "Live", icon: Zap, dot: true },
  { id: "new", label: "New", icon: Sparkles },
  { id: "marketcap", label: "Market cap", icon: DollarSign },
  { id: "mayhem", label: "Mayhem", icon: Flame },
  { id: "oldest", label: "Oldest", icon: Clock },
];

const rarityColors: Record<string, string> = {
  common: "badge-common",
  uncommon: "badge-uncommon",
  rare: "badge-rare",
  ultra: "badge-ultra",
  legendary: "badge-legendary",
};

export default function LiveTokens() {
  const [activeFilter, setActiveFilter] = useState("movers");
  const [activeTab, setActiveTab] = useState("explore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="p-6">
      {/* Trending Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-foreground">TRENDING CARDS</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-primary/10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-primary/10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {trendingTokens.map((token) => (
            <div
              key={token.id}
              className="flex-shrink-0 w-56 pokemon-card cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xl font-display text-white">{token.marketCap}</div>
                  <div className="text-sm text-white/90">
                    {token.name} <span className="text-white/50">{token.ticker}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{token.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider-red mb-6" />

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-4">
        <button
          onClick={() => setActiveTab("explore")}
          className={cn(
            "font-display text-xl tracking-wide transition-colors",
            activeTab === "explore"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          EXPLORE
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={cn(
            "font-display text-xl tracking-wide transition-colors",
            activeTab === "watchlist"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          WATCHLIST
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeFilter === pill.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {pill.dot && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
              {pill.icon && <pill.icon className="w-4 h-4" />}
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-8 h-8 rounded-md", viewMode === "grid" && "bg-primary text-primary-foreground")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-8 h-8 rounded-md", viewMode === "list" && "bg-primary text-primary-foreground")}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allTokens.map((token) => (
          <div
            key={token.id}
            className="pokemon-card cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex gap-3 p-4">
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary/20">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground truncate">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">{token.ticker}</p>
                  </div>
                  <span className={cn("badge-rarity", rarityColors[token.rarity])}>
                    {token.rarity}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                  <span className="font-mono">{token.creator}</span>
                  <span>·</span>
                  <span>{token.time}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-foreground">{token.marketCap}</span>
                  
                  {/* Progress bar */}
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      style={{ width: `${token.progress}%` }}
                    />
                  </div>
                  
                  {token.change !== null && (
                    <span className={cn(
                      "text-xs font-semibold",
                      token.change >= 0 ? "text-[hsl(var(--status-verified))]" : "text-destructive"
                    )}>
                      {token.change >= 0 ? "+" : ""}{token.change.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
