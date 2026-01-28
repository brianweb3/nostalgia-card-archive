import { Camera, Video, Shield, Zap, AlertCircle } from "lucide-react";

export default function Docs() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">How It Works</h1>
        <p className="text-sm text-muted-foreground">Understanding the card verification process</p>
      </div>

      {/* Overview */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">1</span>
            </div>
            <div>
              <h3 className="font-medium">Submit Proof</h3>
              <p className="text-sm text-muted-foreground">Upload photos or record a live video of your physical trading card</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">2</span>
            </div>
            <div>
              <h3 className="font-medium">AI Verification</h3>
              <p className="text-sm text-muted-foreground">Our AI analyzes your submission to verify physical ownership</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">3</span>
            </div>
            <div>
              <h3 className="font-medium">Launch Token</h3>
              <p className="text-sm text-muted-foreground">One verified card = one token. Launch your card-backed token</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Methods */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Proof Methods</h2>
        <div className="grid gap-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Photo Proof</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Upload front and back photos of your card</li>
              <li>• Include a photo showing the card with a handwritten verification code</li>
              <li>• Best for high-quality, well-lit environments</li>
            </ul>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <Video className="w-5 h-5 text-secondary" />
              <h3 className="font-medium">Live Video Proof</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Record a live video showing your card from all angles</li>
              <li>• Rotate and flip the card to demonstrate physical possession</li>
              <li>• Best for quick verification without handwritten codes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Rarity Tiers</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="badge-rarity badge-common">Common</span>
              <span className="text-sm text-muted-foreground">Standard cards</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="badge-rarity badge-uncommon">Uncommon</span>
              <span className="text-sm text-muted-foreground">Above average rarity</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="badge-rarity badge-rare">Rare</span>
              <span className="text-sm text-muted-foreground">Holofoil and special prints</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="badge-rarity badge-ultra">Ultra Rare</span>
              <span className="text-sm text-muted-foreground">Full art, VMAX, etc.</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="badge-rarity badge-legendary">Legendary</span>
              <span className="text-sm text-muted-foreground">1st editions, PSA 10, etc.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Logic */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Verification Logic</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-medium">AI-Powered Analysis</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong>Visual Match:</strong> Compares card imagery against known database</li>
            <li><strong>Freshness Check:</strong> Ensures submission is recent and unique</li>
            <li><strong>Consistency:</strong> Validates all angles and details match</li>
            <li><strong>Fraud Detection:</strong> Checks for manipulation or duplicates</li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="bg-muted/50 rounded-lg border border-border p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-2">Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
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
