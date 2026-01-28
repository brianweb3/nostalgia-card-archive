import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokeballScene } from "@/components/3d/PokeballScene";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

// Monster card illustration component
const MonsterCard = () => (
  <div className="card-frame-gold p-3 w-[280px] animate-float">
    {/* Header */}
    <div className="flex items-center justify-between mb-2">
      <span className="badge-legendary px-2 py-1 rounded text-xs font-bold">LEGENDARY</span>
      <span className="hp-badge">HP 250 <span className="text-primary">●</span></span>
    </div>
    
    {/* Card image area */}
    <div className="card-image-frame aspect-square mb-3">
      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center">
        <div className="text-6xl">🐉</div>
      </div>
    </div>
    
    {/* Card title */}
    <div className="text-center py-2 border-t-2 border-b-2 border-border">
      <span className="font-display text-lg tracking-wider text-foreground">
        NO. 001 - THE GENESIS CARD
      </span>
    </div>
  </div>
);

// Info panel component
const InfoPanel = () => (
  <div className="info-panel w-[320px]">
    <div className="flex items-center gap-2 mb-4">
      <h3 className="font-display text-3xl text-panel-foreground tracking-wide">
        MARKET MOVER
      </h3>
      <Zap className="w-6 h-6 text-secondary" />
    </div>
    
    <div className="dashed-line mb-4" />
    
    <p className="text-panel-foreground/70 text-sm leading-relaxed mb-6">
      A legendary duo that appears when the market is volatile. It is said that their 
      holders will experience prosperity beyond traditional assets.
    </p>
    
    <div className="space-y-2">
      <span className="font-display text-secondary text-lg">CA:</span>
      <div className="bg-muted rounded-lg px-3 py-2">
        <code className="text-xs text-muted-foreground break-all">
          5a7Hks6Rp7PaVnpXFyWRuGRSK2nsQoD4aGs7zWPJpump
        </code>
      </div>
    </div>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-background bg-dots relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="font-display text-3xl text-foreground tracking-wider">
            CARDPUMP
          </div>
          <Link to="/app">
            <Button className="btn-game text-base px-6 py-3">
              Launch App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left - Card Preview */}
            <div className="relative">
              <MonsterCard />
              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gold rounded-full scale-150" />
            </div>

            {/* Center - 3D Ball */}
            <div className="relative w-[200px] h-[300px] hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-accent/20 blur-[60px]" />
                <PokeballScene />
              </div>
            </div>

            {/* Right - Info Panel */}
            <div className="relative">
              <InfoPanel />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="section-panel">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">AI VERIFIED</h3>
                <p className="text-muted-foreground text-sm">
                  Our AI scans and authenticates your physical cards instantly
                </p>
              </div>

              {/* Feature 2 */}
              <div className="section-panel">
                <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">TOKENIZED</h3>
                <p className="text-muted-foreground text-sm">
                  Each verified card becomes a unique token on Solana
                </p>
              </div>

              {/* Feature 3 */}
              <div className="section-panel">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">INSTANT</h3>
                <p className="text-muted-foreground text-sm">
                  Launch your token on pump.fun in minutes, not days
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-16 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <AnimatedCounter 
                  value={12847} 
                  className="font-display text-4xl text-foreground"
                />
                <div className="text-sm text-muted-foreground mt-1">Cards Verified</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-foreground">
                  $<AnimatedCounter value={4.2} decimals={1} />M
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Volume</div>
              </div>
              <div className="text-center">
                <AnimatedCounter 
                  value={98.7} 
                  suffix="%" 
                  decimals={1}
                  className="font-display text-4xl text-foreground"
                />
                <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-border">
          <div className="container mx-auto flex items-center justify-between">
            <div className="font-display text-xl text-muted-foreground">
              CARDPUMP
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 CardPump. Not affiliated with any card game companies.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
