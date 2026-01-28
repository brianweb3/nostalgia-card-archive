import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for tokens
const mockTokens = [
  { id: "1", name: "Charizard Holo 1st Ed", rarity: "legendary", cardId: "PSA-10-001", timestamp: "2m ago", image: "/placeholder.svg" },
  { id: "2", name: "Pikachu VMAX Rainbow", rarity: "ultra", cardId: "CGC-9.5-042", timestamp: "5m ago", image: "/placeholder.svg" },
  { id: "3", name: "Blastoise Base Set", rarity: "rare", cardId: "BGS-9-089", timestamp: "8m ago", image: "/placeholder.svg" },
  { id: "4", name: "Mewtwo GX Full Art", rarity: "ultra", cardId: "PSA-9-156", timestamp: "12m ago", image: "/placeholder.svg" },
  { id: "5", name: "Gyarados Shiny", rarity: "rare", cardId: "CGC-8.5-203", timestamp: "15m ago", image: "/placeholder.svg" },
  { id: "6", name: "Venusaur 1st Edition", rarity: "rare", cardId: "PSA-8-034", timestamp: "18m ago", image: "/placeholder.svg" },
  { id: "7", name: "Umbreon VMAX Alt Art", rarity: "legendary", cardId: "BGS-10-001", timestamp: "22m ago", image: "/placeholder.svg" },
  { id: "8", name: "Lugia Neo Genesis", rarity: "ultra", cardId: "PSA-9-009", timestamp: "25m ago", image: "/placeholder.svg" },
  { id: "9", name: "Mew Gold Star", rarity: "legendary", cardId: "CGC-9-101", timestamp: "28m ago", image: "/placeholder.svg" },
  { id: "10", name: "Dragonite Holo", rarity: "rare", cardId: "PSA-8-149", timestamp: "32m ago", image: "/placeholder.svg" },
  { id: "11", name: "Espeon Prime", rarity: "ultra", cardId: "BGS-9.5-081", timestamp: "35m ago", image: "/placeholder.svg" },
  { id: "12", name: "Rayquaza V Alt", rarity: "legendary", cardId: "PSA-10-194", timestamp: "38m ago", image: "/placeholder.svg" },
  { id: "13", name: "Snorlax VMAX", rarity: "rare", cardId: "CGC-9-142", timestamp: "42m ago", image: "/placeholder.svg" },
  { id: "14", name: "Gengar VMAX", rarity: "ultra", cardId: "PSA-9-271", timestamp: "45m ago", image: "/placeholder.svg" },
  { id: "15", name: "Ho-Oh Legend", rarity: "legendary", cardId: "BGS-9-111", timestamp: "48m ago", image: "/placeholder.svg" },
];

const rarityColors: Record<string, string> = {
  common: "badge-common",
  uncommon: "badge-uncommon",
  rare: "badge-rare",
  ultra: "badge-ultra",
  legendary: "badge-legendary",
};

export default function LiveTokens() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const filteredTokens = mockTokens.filter((token) => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.cardId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = !selectedRarity || token.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Tokens</h1>
          <p className="text-sm text-muted-foreground">All verified card-backed tokens</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{mockTokens.length} live</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <select
            value={selectedRarity || ""}
            onChange={(e) => setSelectedRarity(e.target.value || null)}
            className="h-9 pl-3 pr-8 rounded-md bg-muted border border-border text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="ultra">Ultra Rare</option>
            <option value="legendary">Legendary</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Card</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Token Name</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Rarity</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Card ID</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTokens.map((token) => (
              <tr key={token.id} className="table-row-hover cursor-pointer">
                <td className="px-4 py-3">
                  <div className="card-thumb">
                    <img src={token.image} alt={token.name} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{token.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("badge-rarity", rarityColors[token.rarity])}>
                    {token.rarity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground">{token.cardId}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <span className="badge-status badge-verified">Verified</span>
                    <span className="badge-status badge-live">Live</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{token.timestamp}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tokens found matching your criteria
        </div>
      )}
    </div>
  );
}
