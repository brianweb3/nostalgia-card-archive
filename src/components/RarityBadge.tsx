import { Star } from 'lucide-react';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'ultra' | 'legendary';

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
}

const rarityConfig: Record<Rarity, { label: string; stars: number; className: string }> = {
  common: { label: 'Common', stars: 1, className: 'badge-common' },
  uncommon: { label: 'Uncommon', stars: 2, className: 'badge-uncommon' },
  rare: { label: 'Rare', stars: 3, className: 'badge-rare' },
  ultra: { label: 'Ultra Rare', stars: 4, className: 'badge-ultra' },
  legendary: { label: 'Legendary', stars: 5, className: 'badge-legendary' },
};

export const RarityBadge = ({ rarity, className = '' }: RarityBadgeProps) => {
  const config = rarityConfig[rarity];

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
        ${config.className} ${className}
      `}
    >
      <span>{config.label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: config.stars }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
    </div>
  );
};

export default RarityBadge;
