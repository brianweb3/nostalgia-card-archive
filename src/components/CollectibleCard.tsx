import { RarityBadge, type Rarity } from './RarityBadge';
import { StatusBadge, type Status } from './StatusBadge';
import { SparkleGroup } from './Sparkle';

export interface CardData {
  id: string;
  name: string;
  serialNumber: string;
  rarity: Rarity;
  status: Status;
  image: string;
  element?: string;
}

interface CollectibleCardProps {
  card: CardData;
  featured?: boolean;
  className?: string;
}

const elementColors: Record<string, string> = {
  fire: 'from-red-400/20 to-orange-300/20',
  water: 'from-blue-400/20 to-cyan-300/20',
  plant: 'from-green-400/20 to-lime-300/20',
  electric: 'from-yellow-400/20 to-amber-300/20',
  shadow: 'from-purple-400/20 to-indigo-300/20',
  legendary: 'from-amber-400/30 to-yellow-200/30',
};

export const CollectibleCard = ({ card, featured = false, className = '' }: CollectibleCardProps) => {
  const isRare = ['rare', 'ultra', 'legendary'].includes(card.rarity);
  const elementGradient = elementColors[card.element || 'fire'] || elementColors.fire;

  return (
    <div
      className={`
        card-frame card-lift relative
        ${featured ? 'w-80 featured-glow animate-float' : 'w-full max-w-xs'}
        ${isRare ? 'foil-shimmer' : ''}
        ${className}
      `}
    >
      {/* Inner card content */}
      <div className="p-3">
        {/* Card header with name and rarity */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-card-foreground truncate pr-2">
            {card.name}
          </h3>
          <RarityBadge rarity={card.rarity} />
        </div>

        {/* Image container */}
        <div 
          className={`
            relative rounded-xl overflow-hidden mb-3 aspect-square
            bg-gradient-to-br ${elementGradient}
          `}
        >
          {/* Inner frame border */}
          <div className="absolute inset-1 rounded-lg border-2 border-card-border/50 pointer-events-none z-10" />
          
          {/* Monster image */}
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain p-4"
          />

          {/* Sparkles for rare cards */}
          {isRare && <SparkleGroup count={card.rarity === 'legendary' ? 8 : 5} />}
        </div>

        {/* Card footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-muted-foreground">
            #{card.serialNumber}
          </div>
          <StatusBadge status={card.status} />
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-card-border/60 rounded-tl-lg" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-card-border/60 rounded-tr-lg" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-card-border/60 rounded-bl-lg" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-card-border/60 rounded-br-lg" />
    </div>
  );
};

export default CollectibleCard;
