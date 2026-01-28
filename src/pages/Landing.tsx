import { Link } from "react-router-dom";
import { ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokeballScene } from "@/components/3d/PokeballScene";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const { toast } = useToast();

  const copyCA = () => {
    navigator.clipboard.writeText("coming-soon");
    toast({ title: "Copied!", description: "Contract address copied" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header Bar */}
      <header className="border-b-2 border-foreground bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary px-3 py-1 border-2 border-foreground">
              <span className="font-display text-xl text-primary-foreground">POKE.FUN</span>
            </div>
            <span className="text-muted-foreground font-mono text-sm hidden sm:block">VERIFIED CARDS</span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <Link to="/app">
              <Button variant="ghost" className="font-mono text-xs uppercase">
                MAIN
              </Button>
            </Link>
            <Link to="/app/docs">
              <Button variant="ghost" className="font-mono text-xs uppercase">
                DOCS
              </Button>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 border-2 border-foreground px-3 py-1.5 bg-card">
              <span className="font-mono text-xs text-muted-foreground">CA:</span>
              <span className="font-mono text-xs">coming...soon</span>
              <button onClick={copyCA} className="text-primary hover:text-primary/80">
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <Link to="/app">
              <Button className="font-mono text-xs uppercase bg-primary border-2 border-foreground">
                LAUNCH APP
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-primary/10 border border-primary px-3 py-1">
                <span className="text-primary font-mono text-sm uppercase">
                  ■ LIVE • AI-VERIFIED CARDS
                </span>
              </div>
              <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-none text-foreground">
                POKE.FUN
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg font-mono leading-relaxed">
                Transform your physical trading cards into verified digital tokens. 
                AI-powered verification ensures authenticity.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card">
                <p className="stat-label">VERIFIED</p>
                <p className="stat-value">0</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">LAUNCHED</p>
                <p className="stat-value">0</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">VOLUME</p>
                <p className="stat-value">0 SOL</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/app/create">
                <Button size="lg" className="gap-2 bg-primary border-2 border-foreground font-mono uppercase">
                  Create Token
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/app/docs">
                <Button variant="outline" size="lg" className="border-2 border-foreground font-mono uppercase">
                  Read Manifesto
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - 3D Pokeball */}
          <div className="relative h-[400px] lg:h-[500px]">
            <div className="content-box h-full flex items-center justify-center">
              <PokeballScene />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
