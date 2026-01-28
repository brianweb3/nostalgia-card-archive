import Hero from '@/components/Hero';
import CardBinder from '@/components/CardBinder';
import { type CardData } from '@/components/CollectibleCard';

import monsterFire from '@/assets/monster-fire.png';
import monsterWater from '@/assets/monster-water.png';
import monsterPlant from '@/assets/monster-plant.png';
import monsterElectric from '@/assets/monster-electric.png';
import monsterShadow from '@/assets/monster-shadow.png';
import monsterLegendary from '@/assets/monster-legendary.png';

const featuredCard: CardData = {
  id: 'featured-001',
  name: 'Aurelion Rex',
  serialNumber: '0001',
  rarity: 'legendary',
  status: 'verified',
  image: monsterLegendary,
  element: 'legendary',
};

const collectionCards: CardData[] = [
  {
    id: 'card-001',
    name: 'Embercub',
    serialNumber: '1247',
    rarity: 'common',
    status: 'verified',
    image: monsterFire,
    element: 'fire',
  },
  {
    id: 'card-002',
    name: 'Aquafin',
    serialNumber: '0893',
    rarity: 'uncommon',
    status: 'verified',
    image: monsterWater,
    element: 'water',
  },
  {
    id: 'card-003',
    name: 'Leafsprout',
    serialNumber: '2156',
    rarity: 'common',
    status: 'pending',
    image: monsterPlant,
    element: 'plant',
  },
  {
    id: 'card-004',
    name: 'Sparkhorn',
    serialNumber: '0412',
    rarity: 'rare',
    status: 'verified',
    image: monsterElectric,
    element: 'electric',
  },
  {
    id: 'card-005',
    name: 'Nocturn',
    serialNumber: '0089',
    rarity: 'ultra',
    status: 'verified',
    image: monsterShadow,
    element: 'shadow',
  },
  {
    id: 'card-006',
    name: 'Blazewing',
    serialNumber: '3421',
    rarity: 'rare',
    status: 'pending',
    image: monsterFire,
    element: 'fire',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 paper-texture pointer-events-none" />

      {/* Hero Section */}
      <Hero featuredCard={featuredCard} />

      {/* Collection Section */}
      <section className="relative px-4 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Every card tells a story. Every creature awaits discovery.
          </p>
        </div>

        <CardBinder cards={collectionCards} />
      </section>

      {/* Footer */}
      <footer className="relative px-4 py-12 text-center border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-sm">
            © 2024 Mythical Creatures. All creatures are original designs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
