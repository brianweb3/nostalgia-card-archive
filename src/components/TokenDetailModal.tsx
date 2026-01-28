import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, User, TrendingUp, Shield, Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface TokenDetailModalProps {
  token: TokenData | null;
  open: boolean;
  onClose: () => void;
}

const rarityColors: Record<string, string> = {
  common: "badge-common",
  uncommon: "badge-uncommon",
  rare: "badge-rare",
  ultra: "badge-ultra",
  legendary: "badge-legendary",
};

export function TokenDetailModal({ token, open, onClose }: TokenDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!token) return null;

  const pumpfunUrl = token.pumpfunUrl || `https://pump.fun/coin/${token.ticker.toLowerCase()}`;
  const verifiedDate = token.verifiedAt || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(pumpfunUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="sr-only">{token.name} Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Card Image & Basic Info */}
          <div className="flex gap-4">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/30 flex-shrink-0">
              <img
                src={token.image}
                alt={token.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl text-foreground">{token.name}</h2>
                  <p className="text-muted-foreground font-mono">${token.ticker}</p>
                </div>
                {token.rarity && (
                  <span className={cn("badge-rarity text-sm", rarityColors[token.rarity])}>
                    {token.rarity}
                  </span>
                )}
              </div>
              
              {token.description && (
                <p className="text-sm text-muted-foreground">{token.description}</p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TrendingUp className="w-4 h-4" />
                Market Cap
              </div>
              <div className="font-display text-2xl text-foreground">${token.marketCap}</div>
            </div>
            
            {token.change !== undefined && token.change !== null && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                <div className="text-muted-foreground text-sm">24h Change</div>
                <div className={cn(
                  "font-display text-2xl",
                  token.change >= 0 ? "text-[hsl(var(--status-verified))]" : "text-destructive"
                )}>
                  {token.change >= 0 ? "+" : ""}{token.change.toFixed(2)}%
                </div>
              </div>
            )}
            
            {token.creator && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="w-4 h-4" />
                  Creator
                </div>
                <div className="font-mono text-foreground">{token.creator}</div>
              </div>
            )}
            
            {token.time && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  Listed
                </div>
                <div className="text-foreground">{token.time} ago</div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {token.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bonding Progress</span>
                <span className="text-foreground font-medium">{token.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                  style={{ width: `${token.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Verification Badge */}
          <div className="flex items-center gap-3 p-3 bg-[hsl(var(--status-verified))]/10 rounded-lg border border-[hsl(var(--status-verified))]/20">
            <Shield className="w-5 h-5 text-[hsl(var(--status-verified))]" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">AI Verified</div>
              <div className="text-xs text-muted-foreground">{verifiedDate}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-[hsl(var(--status-verified))]" />
          </div>

          {/* Pump.fun Link */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Pump.fun Link</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-sm text-foreground truncate">
                {pumpfunUrl}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-primary/30 hover:bg-primary/10"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-[hsl(var(--status-verified))]" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              onClick={() => window.open(pumpfunUrl, "_blank")}
            >
              Trade on Pump.fun
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
