import { useState, useEffect } from "react";
import { Eye, Cpu, Shield, Sparkles, Scan, Brain, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIVerificationLoaderProps {
  progress: number;
  cardName?: string;
}

const stages = [
  { icon: Scan, label: "Scanning card images...", threshold: 0 },
  { icon: Eye, label: "Analyzing card details...", threshold: 20 },
  { icon: Brain, label: "AI processing ownership proof...", threshold: 40 },
  { icon: Shield, label: "Verifying authenticity...", threshold: 60 },
  { icon: Cpu, label: "Cross-referencing database...", threshold: 80 },
  { icon: CheckCircle, label: "Finalizing verification...", threshold: 95 },
];

export function AIVerificationLoader({ progress, cardName }: AIVerificationLoaderProps) {
  const [glitchText, setGlitchText] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);

  // Generate random particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const currentStage = stages.reduce((acc, stage) => 
    progress >= stage.threshold ? stage : acc, stages[0]);

  const CurrentIcon = currentStage.icon;

  return (
    <div className="relative max-w-xl mx-auto animate-fade-in overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      <div className="relative bg-background p-8 text-center">
        {/* Scan line effect */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Main animated icon */}
        <div className="relative mb-8">
          {/* Outer rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-24 h-24 rounded-full border-2 border-dashed border-primary/50 animate-spin" 
              style={{ animationDuration: '8s' }}
            />
          </div>
          
          {/* Center icon */}
          <div className="relative flex items-center justify-center h-40">
            <div className="relative w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <CurrentIcon className="w-10 h-10 text-primary animate-pulse" />
              
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-primary" />
            </div>
          </div>
        </div>

        {/* Title with glitch effect */}
        <h2 className={cn(
          "font-display text-3xl text-foreground mb-2 transition-all",
          glitchText && "text-primary translate-x-0.5"
        )}>
          {glitchText ? "VER1FY1NG..." : "VERIFYING..."}
        </h2>

        <p className="text-muted-foreground mb-2">
          {currentStage.label}
        </p>
        
        {cardName && (
          <p className="text-sm text-primary font-mono mb-6">
            [{cardName.toUpperCase()}]
          </p>
        )}

        {/* Progress bar with gradient */}
        <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden mb-4">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 animate-pulse" />
          
          {/* Progress fill */}
          <div
            className="relative h-full rounded-full transition-all duration-500 overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary" />
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
          
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between px-1">
            {[20, 40, 60, 80].map((tick) => (
              <div
                key={tick}
                className={cn(
                  "w-0.5 h-full transition-colors",
                  progress >= tick ? "bg-background/30" : "bg-border/30"
                )}
                style={{ marginLeft: `${tick - 1}%`, position: 'absolute' }}
              />
            ))}
          </div>
        </div>

        {/* Percentage with animation */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-2xl font-bold text-primary">
            {Math.round(progress)}%
          </span>
          <span className="text-muted-foreground text-sm">complete</span>
        </div>

        {/* Stage indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {stages.slice(0, 5).map((stage, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                progress >= stage.threshold 
                  ? "bg-primary scale-100" 
                  : "bg-muted scale-75"
              )}
            />
          ))}
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              style={{
                animation: 'bounce 1s infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Tech decoration text */}
        <div className="mt-6 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
          ai.verify.v2.4.1 • neural-net-active • blockchain-ready
        </div>
      </div>
    </div>
  );
}
