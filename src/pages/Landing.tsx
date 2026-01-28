import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PokeballScene } from "@/components/3d/PokeballScene";
export default function Landing() {
  return <div className="min-h-screen bg-background">
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
          {/* Left - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              
              <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-none text-foreground">
                POKE.FUN
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg font-mono leading-relaxed">
                Transform your physical trading cards into verified digital tokens. 
                AI-powered verification ensures authenticity.
              </p>
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
          <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
            <PokeballScene />
          </div>
        </div>
      </main>
    </div>;
}