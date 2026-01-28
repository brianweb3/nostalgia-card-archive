import { Camera, Video, Shield, Zap, AlertCircle } from "lucide-react";

export default function Docs() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">HOW IT WORKS</h1>
        <p className="text-muted-foreground">Understanding the card verification process</p>
      </div>

      {/* Divider */}
      <div className="divider-red mb-8" />

      {/* Overview */}
      <section className="mb-8">
        <h2 className="font-display text-2xl text-foreground mb-4">OVERVIEW</h2>
        <div className="pokemon-card p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Submit Proof</h3>
              <p className="text-muted-foreground">Upload photos or record a live video of your physical trading card</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">AI Verification</h3>
              <p className="text-muted-foreground">Our AI analyzes your submission to verify physical ownership</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-display text-lg text-primary-foreground">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Launch Token</h3>
              <p className="text-muted-foreground">One verified card = one token. Launch your card-backed token</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Methods */}
      <section className="mb-8">
        <h2 className="font-display text-2xl text-foreground mb-4">PROOF METHODS</h2>
        <div className="grid gap-4">
          <div className="pokemon-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground">PHOTO PROOF</h3>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li>• Upload front and back photos of your card</li>
              <li>• Include a photo showing the card with a handwritten verification code</li>
              <li>• Best for high-quality, well-lit environments</li>
            </ul>
          </div>
          <div className="pokemon-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-display text-xl text-foreground">VIDEO PROOF</h3>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li>• Record a live video showing your card from all angles</li>
              <li>• Rotate and flip the card to demonstrate physical possession</li>
              <li>• Best for quick verification without handwritten codes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="mb-8">
        <h2 className="font-display text-2xl text-foreground mb-4">RARITY TIERS</h2>
        <div className="pokemon-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="badge-rarity badge-common">Common</span>
              <span className="text-muted-foreground">Standard cards</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="badge-rarity badge-uncommon">Uncommon</span>
              <span className="text-muted-foreground">Above average rarity</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="badge-rarity badge-rare">Rare</span>
              <span className="text-muted-foreground">Holofoil and special prints</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="badge-rarity badge-ultra">Ultra Rare</span>
              <span className="text-muted-foreground">Full art, VMAX, etc.</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="badge-rarity badge-legendary">Legendary</span>
              <span className="text-muted-foreground">1st editions, PSA 10, etc.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="pokemon-card p-6 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-2">DISCLAIMER</h3>
              <p className="text-muted-foreground">
                This platform is not affiliated with, endorsed by, or connected to any trading card game companies 
                including but not limited to The Pokémon Company, Nintendo, Wizards of the Coast, or any other 
                card manufacturers. All card verification is performed independently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
