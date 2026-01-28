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
      <DialogContent className="max-w-lg bg-card border-2 border-foreground p-0 rounded-none relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))' }}>
        <DialogHeader className="sr-only">
          <DialogTitle>{token.name} Details</DialogTitle>
        </DialogHeader>
        
        {/* Header bar */}
        <div className="header-bar">
          <span className="font-mono text-sm">{token.name}</span>
          <span className="font-mono text-sm">${token.ticker}</span>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Card Image & Basic Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 border-2 border-foreground flex-shrink-0 overflow-hidden">
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
                  <p className="text-primary font-mono">${token.ticker}</p>
                </div>
                {token.rarity && (
                  <span className={cn("badge-rarity", rarityColors[token.rarity])}>
                    {token.rarity}
                  </span>
                )}
              </div>
              
              {token.description && (
                <p className="text-sm text-muted-foreground font-mono">{token.description}</p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 border-2 border-foreground">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                MARKET CAP
              </div>
              <div className="font-mono text-lg text-primary font-bold">${token.marketCap}</div>
            </div>
            
            <div className="p-3 border-2 border-foreground">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs mb-1">
                <User className="w-3 h-3" />
                CREATOR
              </div>
              <div className="font-mono text-sm text-foreground">{token.creator || 'Unknown'}</div>
            </div>
          </div>

          {/* Progress Bar */}
          {token.progress !== undefined && (
            <div className="p-3 border-2 border-foreground">
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className="text-muted-foreground">BONDING PROGRESS</span>
                <span className="text-primary">{token.progress}%</span>
              </div>
              <div className="h-2 bg-muted border border-foreground overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${token.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Verification Badge */}
          <div className="flex items-center gap-3 p-3 border-2 border-[hsl(var(--status-verified))] bg-[hsl(var(--status-verified))]/10">
            <Shield className="w-5 h-5 text-[hsl(var(--status-verified))]" />
            <div className="flex-1">
              <div className="font-mono text-xs font-bold text-foreground">AI VERIFIED</div>
              <div className="font-mono text-[10px] text-muted-foreground">{verifiedDate}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-[hsl(var(--status-verified))]" />
          </div>

          {/* Pump.fun Link */}
          <div className="flex gap-2">
            <div className="flex-1 border-2 border-foreground px-3 py-2 font-mono text-xs text-foreground truncate bg-muted">
              {pumpfunUrl}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-2 border-foreground"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-[hsl(var(--status-verified))]" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2 bg-primary border-2 border-foreground font-mono text-xs uppercase"
              onClick={() => window.open(pumpfunUrl, "_blank")}
            >
              Trade on Pump.fun
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-foreground font-mono text-xs uppercase" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
