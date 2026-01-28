import CollectibleCard, { type CardData } from './CollectibleCard';

interface CardBinderProps {
  cards: CardData[];
  className?: string;
}

export const CardBinder = ({ cards, className = '' }: CardBinderProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Binder texture background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card-highlight/30 via-card to-card-border/20 rounded-3xl" />
      <div className="absolute inset-0 paper-texture rounded-3xl" />
      
      {/* Binder ring holes */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-8 rounded-full bg-muted border-2 border-card-border shadow-inner"
          />
        ))}
      </div>

      {/* Cards grid */}
      <div className="relative pl-16 pr-6 py-8">
        <div className="binder-grid">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CollectibleCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardBinder;
