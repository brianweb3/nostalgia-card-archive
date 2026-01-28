import { ShieldCheck, AlertTriangle, Eye, Lock, Sparkles, BadgeCheck } from "lucide-react";

export default function Docs() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="content-box mb-8">
        <div className="header-bar">
          <span className="font-mono text-sm">POKE.FUN</span>
          <span className="font-mono text-sm">MANIFESTO</span>
        </div>
        <div className="p-6">
          <h1 className="font-display text-5xl text-foreground mb-2">DOCUMENTATION</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Everything you need to know about POKE.FUN
          </p>
          <p className="text-xs text-muted-foreground font-mono mt-2">
            VERSION 1.0.0 • LAST UPDATED: 2025-01-28
          </p>
        </div>
      </div>

      {/* Contents Sidebar + Main Content */}
      <div className="grid md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <div className="content-box h-fit">
          <div className="section-header">CONTENTS</div>
          <div className="p-4 space-y-2 font-mono text-sm">
            <a href="#overview" className="block hover:text-primary">01. OVERVIEW</a>
            <a href="#problem" className="block hover:text-primary">02. THE PROBLEM</a>
            <a href="#solution" className="block hover:text-primary">03. THE SOLUTION</a>
            <a href="#how-it-works" className="block hover:text-primary">04. HOW IT WORKS</a>
            <a href="#principles" className="block hover:text-primary">05. OUR PRINCIPLES</a>
          </div>
          <div className="section-header">LINKS</div>
          <div className="p-4 space-y-2 font-mono text-sm">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">→ Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">→ Discord</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Overview */}
          <div id="overview" className="content-box">
            <div className="section-header">
              <span className="text-primary mr-2">01</span> OVERVIEW
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <p>POKE.FUN is a token launch platform for physical collectible cards backed by AI-verified ownership.</p>
              <p>Users can only launch tokens for cards they physically own and have verified through AI-based proof analysis.</p>
              <p>This prevents unverified or fictional card tokens from being launched.</p>
            </div>
          </div>

          {/* The Problem */}
          <div id="problem" className="content-box">
            <div className="section-header">
              <span className="text-primary mr-2">02</span> THE PROBLEM
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <p>— Anyone can mint a token called "Charizard 1st Edition" without owning the actual card.</p>
              <p>— The memecoin space is flooded with tokens claiming to represent rare collectibles that the creators never possessed.</p>
              <p>— Buyers have no way to verify if the token creator actually owns the card.</p>
              <p className="text-destructive">— Result: Scams, rug pulls, and zero accountability.</p>
            </div>
          </div>

          {/* The Solution */}
          <div id="solution" className="content-box">
            <div className="section-header">
              <span className="text-primary mr-2">03</span> THE SOLUTION
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <p>— POKE.FUN requires proof before launching any token.</p>
              <p>— Creators must submit photographic evidence proving they physically own the card.</p>
              <p>— Our AI verification system analyzes card photos alongside ownership proof.</p>
              <p className="text-[hsl(var(--status-verified))]">— Result: Every POKE.FUN token is backed by a real, verified card.</p>
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="content-box">
            <div className="section-header">
              <span className="text-primary mr-2">04</span> HOW IT WORKS
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <p>1. Upload card front photo — clear, well-lit.</p>
              <p>2. Upload card back photo — verify authenticity.</p>
              <p>3. Upload ownership proof — card + handwritten ID.</p>
              <p>4. AI Verification — ~30 seconds analysis.</p>
              <p>5. Launch Token — deploy on pump.fun.</p>
            </div>
          </div>

          {/* Principles */}
          <div id="principles" className="content-box">
            <div className="section-header">
              <span className="text-primary mr-2">05</span> OUR PRINCIPLES
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="uppercase font-bold">Transparency</span>
                  </div>
                  <p className="text-muted-foreground">Every token shows verification status.</p>
                </div>
                <div className="p-4 border-2 border-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="uppercase font-bold">No Shortcuts</span>
                  </div>
                  <p className="text-muted-foreground">Can't fake ownership. Can't skip verification.</p>
                </div>
                <div className="p-4 border-2 border-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="uppercase font-bold">One Card = One Token</span>
                  </div>
                  <p className="text-muted-foreground">No duplicates, no counterfeits.</p>
                </div>
                <div className="p-4 border-2 border-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="uppercase font-bold">Collector First</span>
                  </div>
                  <p className="text-muted-foreground">Built for real collectors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
