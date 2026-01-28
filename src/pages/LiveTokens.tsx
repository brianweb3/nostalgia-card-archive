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

const cardImages = [monsterFire, monsterWater, monsterPlant, monsterElectric, monsterShadow, monsterLegendary];

// Trending tokens data
const trendingTokens = [
  { id: "1", name: "Charizard Holo", ticker: "CHAR", marketCap: "$3.56M", image: monsterFire, description: "The Aura of this card Is Too Strong" },
  { id: "2", name: "Blastoise Prime", ticker: "BLAST", marketCap: "$8.10M", image: monsterWater, description: "Cobie Tweet Brings Precious Metals On-Chain" },
  { id: "3", name: "Venusaur 1st", ticker: "VENU", marketCap: "$968.35K", image: monsterPlant, description: "Yo Mama Coin Draws Attention After Fees" },
  { id: "4", name: "Pikachu VMAX", ticker: "PIKA", marketCap: "$92.37M", image: monsterElectric, description: "PENGUIN Hits $100M Market Cap" },
  { id: "5", name: "Gengar Alt", ticker: "GENG", marketCap: "$983.93K", image: monsterShadow, description: "The Meme That Screamed Its Way Into Everything" },
  { id: "6", name: "Mew Gold Star", ticker: "MEW", marketCap: "$7.78M", image: monsterLegendary, description: "A New Body-Part Meme Turns Trading" },
];

// All tokens data
const allTokens = [
  { id: "1", name: "Satoshi", ticker: "Satoshi", creator: "HUgpmq", time: "2m ago", marketCap: "$3.5K", progress: 35, change: null, image: monsterFire, description: "Deployed on https://rapidlaunch.io" },
  { id: "2", name: "Estcru LLC Winery", ticker: "Estcru", creator: "7LL9li", time: "55m ago", marketCap: "$9.0K", progress: 65, change: -18.00, image: monsterWater, description: "Fake Somalian Wine Company" },
  { id: "3", name: "Steaks and Beef 500", ticker: "SnB500", creator: "DQfd5M", time: "12m ago", marketCap: "$15.8K", progress: 45, change: -11.00, image: monsterPlant, description: "Steaks and Beef 500 INDEX" },
  { id: "4", name: "Bored Penguin Yacht", ticker: "BPYC", creator: "CqFYQU", time: "10m ago", marketCap: "$6.2K", progress: 25, change: 0.16, image: monsterShadow, description: null },
  { id: "5", name: "24/7 Trading", ticker: "Robinhood", creator: "4jsHZ8", time: "59m ago", marketCap: "$243.2K", progress: 85, change: -36.24, image: monsterElectric, description: null },
  { id: "6", name: "United States Card", ticker: "USTP", creator: "DWPphp", time: "20m ago", marketCap: "$19.1K", progress: 55, change: -5.76, image: monsterLegendary, description: null },
  { id: "7", name: "Gold & Silver", ticker: "POKEMON", creator: "CTDMaY", time: "10h ago", marketCap: "$2.6M", progress: 90, change: -14.62, image: monsterFire, description: null },
  { id: "8", name: "Gold & Silver", ticker: "DIGIMON", creator: "9a8TA5", time: "4m ago", marketCap: "$4.6K", progress: 40, change: 13.15, image: monsterWater, description: "The Digital Monsters : Gold & Silver Edition." },
  { id: "9", name: "lumi", ticker: "LUMI", creator: "EiwjoW", time: "3h ago", marketCap: "$1.2K", progress: 15, change: null, image: monsterPlant, description: null },
  { id: "10", name: "Dog Town", ticker: "Idyllwild", creator: "ApNyqP", time: "9m ago", marketCap: "$8.4K", progress: 50, change: null, image: monsterShadow, description: null },
  { id: "11", name: "Ikea Monkey", ticker: "Monkey", creator: "9cscgf", time: "1 year ago", marketCap: "$156K", progress: 75, change: null, image: monsterElectric, description: null },
  { id: "12", name: "Ikea Orangutan", ticker: "Orangutan", creator: "4vNgQp", time: "6m ago", marketCap: "$2.1K", progress: 20, change: null, image: monsterLegendary, description: null },
];

const filterPills = [
  { id: "movers", label: "Movers", icon: TrendingUp, active: true },
  { id: "live", label: "Live", icon: Zap, dot: true },
  { id: "new", label: "New", icon: Sparkles },
  { id: "marketcap", label: "Market cap", icon: DollarSign },
  { id: "mayhem", label: "Mayhem", icon: Flame },
  { id: "oldest", label: "Oldest", icon: Clock },
  { id: "lastreply", label: "Last reply", icon: MessageSquare },
  { id: "lasttrade", label: "Last trade", icon: Activity },
];

export default function LiveTokens() {
  const [activeFilter, setActiveFilter] = useState("movers");
  const [activeTab, setActiveTab] = useState("explore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="p-6">
      {/* Trending Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Trending cards</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {trendingTokens.map((token) => (
            <div
              key={token.id}
              className="flex-shrink-0 w-52 rounded-xl overflow-hidden bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="text-lg font-bold text-white">{token.marketCap}</div>
                  <div className="text-sm text-white/90">
                    {token.name} <span className="text-white/60">{token.ticker}</span>
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

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-4 border-b border-border">
        <button
          onClick={() => setActiveTab("explore")}
          className={cn(
            "pb-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "explore"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={cn(
            "pb-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "watchlist"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Watchlist
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
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeFilter === pill.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {pill.dot && <span className="w-2 h-2 rounded-full bg-destructive" />}
              {pill.icon && <pill.icon className="w-3.5 h-3.5" />}
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <div className="flex items-center bg-muted rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-8 h-8 rounded-r-none", viewMode === "grid" && "bg-background")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-8 h-8 rounded-l-none", viewMode === "list" && "bg-background")}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allTokens.map((token) => (
          <div
            key={token.id}
            className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="flex gap-3 p-3">
              {/* Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{token.name}</h3>
                <p className="text-sm text-muted-foreground">{token.ticker}</p>
                
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">👤</span>
                  <span className="font-mono">{token.creator}</span>
                  <span>·</span>
                  <span>{token.time}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">MC</span>
                  <span className="text-sm font-semibold text-foreground">{token.marketCap}</span>
                  
                  {/* Progress bar */}
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${token.progress}%` }}
                    />
                  </div>
                  
                  {token.change !== null && (
                    <span className={cn(
                      "text-xs font-medium",
                      token.change >= 0 ? "text-primary" : "text-destructive"
                    )}>
                      {token.change >= 0 ? "↑" : "↓"} {Math.abs(token.change).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {token.description && (
              <div className="px-3 pb-3">
                <p className="text-xs text-muted-foreground line-clamp-1">{token.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
