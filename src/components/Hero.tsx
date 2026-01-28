import CollectibleCard, { type CardData } from './CollectibleCard';
import Sparkle from './Sparkle';

interface HeroProps {
  featuredCard: CardData;
}

export const Hero = ({ featuredCard }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
        
        {/* Floating sparkles */}
        <Sparkle className="absolute top-20 left-[15%] animate-float opacity-60" size={24} />
        <Sparkle className="absolute top-32 right-[20%] animate-float opacity-40" size={16} style={{ animationDelay: '0.5s' }} />
        <Sparkle className="absolute bottom-40 left-[25%] animate-float opacity-50" size={20} style={{ animationDelay: '1s' }} />
        <Sparkle className="absolute bottom-32 right-[30%] animate-float opacity-70" size={18} style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/20 border border-accent/30">
          <span className="text-sm font-semibold text-accent-foreground">✨ New Collection Available</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight">
          Discover Rare
          <span className="block text-primary">Mythical Creatures</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          Collect, trade, and treasure original monster cards. 
          Each one is unique, just like your childhood memories.
        </p>
      </div>

      {/* Featured Card */}
      <div className="relative z-10 mb-10">
        <CollectibleCard card={featuredCard} featured />
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center">
        <button className="btn-sticker">
          Start Collecting
        </button>
        <button className="btn-sticker btn-sticker-secondary">
          View Collection
        </button>
      </div>

      {/* Decorative card shadows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-card-shadow/10 blur-3xl rounded-full" />
    </section>
  );
};

export default Hero;
