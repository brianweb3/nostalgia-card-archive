import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokeballScene } from "@/components/3d/PokeballScene";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(25_95%_53%_/_0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(25_95%_53%_/_0.1),_transparent_50%)]" />
      
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
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              <div className="absolute w-full h-0.5 bg-black/80 top-1/2 -translate-y-1/2" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-black/80 z-10" />
            </div>
            <span className="font-display text-2xl text-foreground">POKE.FUN</span>
          </div>
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
                  Verify. Tokenize. Trade.
                </p>
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-none">
                  <span className="text-foreground">POKE</span>
                  <br />
                  <span className="gradient-text">.FUN</span>
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
                    Manifesto
                  </Button>
                </Link>
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
      </div>
    </div>
  );
}
