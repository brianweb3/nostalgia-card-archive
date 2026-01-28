import { ShieldCheck, AlertTriangle, Eye, Lock, Sparkles, BadgeCheck } from "lucide-react";

export default function Docs() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">MANIFESTO</h1>
        <p className="text-muted-foreground">Why we built POKE.FUN</p>
      </div>

      {/* Divider */}
      <div className="divider-red mb-8" />

      {/* The Problem */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="font-display text-3xl text-foreground">THE PROBLEM</h2>
        </div>
        
        <div className="pokemon-card p-6 border-destructive/30">
          <div className="space-y-4 text-lg">
            <p className="text-foreground leading-relaxed">
              Anyone can mint a token called "Charizard 1st Edition" without owning the actual card. 
              The memecoin space is flooded with tokens claiming to represent rare collectibles 
              that the creators never possessed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This creates a trust crisis. Buyers have no way to verify if the token creator 
              actually owns the card they're tokenizing. It's just a name and a stolen image.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-destructive font-semibold">
                Result: Scams, rug pulls, and zero accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--status-verified))]/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[hsl(var(--status-verified))]" />
          </div>
          <h2 className="font-display text-3xl text-foreground">THE SOLUTION</h2>
        </div>
        
        <div className="pokemon-card p-6 border-[hsl(var(--status-verified))]/30">
          <div className="space-y-4 text-lg">
            <p className="text-foreground leading-relaxed">
              <strong className="text-primary">POKE.FUN requires proof.</strong> Before launching any token, 
              creators must submit photographic evidence proving they physically own the card.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI verification system analyzes your card photo alongside ownership proof — 
              a photo with your unique verification ID on paper. No proof, no token.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-[hsl(var(--status-verified))] font-semibold">
                Result: Every POKE.FUN token is backed by a real, verified card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Verification Works */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-foreground mb-6">HOW IT WORKS</h2>
        
        <div className="grid gap-4">
          <div className="pokemon-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Upload Card Front</h3>
              <p className="text-muted-foreground">Take a clear photo of your trading card — front facing, well-lit.</p>
            </div>
          </div>

          <div className="pokemon-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Upload Card Back</h3>
              <p className="text-muted-foreground">
                Capture the back of the same card to verify authenticity and condition.
              </p>
            </div>
          </div>

          <div className="pokemon-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Prove Ownership</h3>
              <p className="text-muted-foreground">
                Submit a photo of your card next to a handwritten note with your unique verification ID. 
                This proves you have physical possession right now.
              </p>
            </div>
          </div>

          <div className="pokemon-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">AI Verification</h3>
              <p className="text-muted-foreground">
                Our AI analyzes all images to confirm: same card, genuine ownership proof, 
                no manipulation. Verification takes ~30 seconds.
              </p>
            </div>
          </div>

          <div className="pokemon-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">5</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Launch Token</h3>
              <p className="text-muted-foreground">
                Only after verification passes can you deploy your token on pump.fun. 
                Your token is now backed by a real, verified card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-foreground mb-6">OUR PRINCIPLES</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="pokemon-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground">TRANSPARENCY</h3>
            </div>
            <p className="text-muted-foreground">
              Every token shows its verification status. Community can see proof that the card exists.
            </p>
          </div>

          <div className="pokemon-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground">NO SHORTCUTS</h3>
            </div>
            <p className="text-muted-foreground">
              Can't fake ownership. Can't skip verification. No exceptions for "rare" cards.
            </p>
          </div>

          <div className="pokemon-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <BadgeCheck className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground">ONE CARD = ONE TOKEN</h3>
            </div>
            <p className="text-muted-foreground">
              Each physical card can only be tokenized once. No duplicates, no counterfeits.
            </p>
          </div>

          <div className="pokemon-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground">COLLECTOR FIRST</h3>
            </div>
            <p className="text-muted-foreground">
              Built for real collectors who want to bring their cards on-chain with integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="pokemon-card p-8 text-center border-primary/30">
          <h2 className="font-display text-3xl text-foreground mb-4">
            OWN THE CARD. PROVE IT. LAUNCH IT.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            POKE.FUN is the only platform where token authenticity is guaranteed by 
            AI-verified physical ownership. If you don't have the card, you can't launch the token.
          </p>
        </div>
      </section>
    </div>
  );
}
