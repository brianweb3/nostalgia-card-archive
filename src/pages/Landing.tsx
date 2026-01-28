import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokeballScene } from "@/components/3d/PokeballScene";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(0_85%_50%_/_0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(0_85%_50%_/_0.1),_transparent_50%)]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - just Launch App button */}
        <header className="flex items-center justify-end px-8 py-6">
          <Link to="/app">
            <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center">
          <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm">
                  The Future of Card Trading
                </p>
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-none">
                  <span className="text-foreground">CARD</span>
                  <br />
                  <span className="gradient-text">PUMP</span>
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Transform your physical trading cards into verified digital tokens. 
                AI-powered verification ensures authenticity. One card — one token.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8">
                    Start Trading
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/app/docs">
                  <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">AI Verified</h3>
                  <p className="text-sm text-muted-foreground">Automatic card authentication</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Tokenized</h3>
                  <p className="text-sm text-muted-foreground">Physical cards backed tokens</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Instant</h3>
                  <p className="text-sm text-muted-foreground">Launch in minutes</p>
                </div>
              </div>

              {/* Stats inline */}
              <div className="flex items-center gap-10 pt-4">
                <div>
                  <AnimatedCounter 
                    value={12847} 
                    className="text-2xl md:text-3xl text-foreground"
                  />
                  <div className="text-xs text-muted-foreground">Cards Verified</div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl text-foreground">
                    $<AnimatedCounter value={4.2} decimals={1} className="text-2xl md:text-3xl" />M
                  </div>
                  <div className="text-xs text-muted-foreground">Total Volume</div>
                </div>
                <div>
                  <AnimatedCounter 
                    value={98.7} 
                    suffix="%" 
                    decimals={1}
                    className="text-2xl md:text-3xl text-foreground"
                  />
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right - 3D Pokeball */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Glow effect behind */}
                <div className="absolute w-64 h-64 rounded-full bg-primary/20 blur-[80px]" />
                <PokeballScene />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4">
          <div className="container mx-auto flex items-center justify-end">
            <div className="text-sm text-muted-foreground">
              © 2024 CardPump. Not affiliated with any card game companies.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
