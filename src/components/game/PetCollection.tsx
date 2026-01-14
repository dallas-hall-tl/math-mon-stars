import { Pet, PetRank } from '@/types/game';
import { PetCard } from './PetCard';
import { cn } from '@/lib/utils';

interface PetCollectionProps {
  pets: Pet[];
  equippedPetIds: string[];
  onToggleEquip: (petId: string) => void;
}

const rankOrder: PetRank[] = ['neon', 'diamond', 'gold', 'bronze'];

export function PetCollection({ pets, equippedPetIds, onToggleEquip }: PetCollectionProps) {
  const sortedPets = [...pets].sort((a, b) => {
    const rankDiff = rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    if (rankDiff !== 0) return rankDiff;
    return b.correctStreak - a.correctStreak;
  });

  const stats = {
    total: pets.length,
    neon: pets.filter(p => p.rank === 'neon').length,
    diamond: pets.filter(p => p.rank === 'diamond').length,
    gold: pets.filter(p => p.rank === 'gold').length,
    bronze: pets.filter(p => p.rank === 'bronze').length,
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">📚 My Pets</h2>
        <p className="text-muted-foreground">Tap to equip for mining!</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        <StatBadge label="Total" value={stats.total} />
        <StatBadge label="Neon" value={stats.neon} color="neon" />
        <StatBadge label="Diamond" value={stats.diamond} color="diamond" />
        <StatBadge label="Gold" value={stats.gold} color="gold" />
        <StatBadge label="Bronze" value={stats.bronze} color="bronze" />
      </div>

      {/* Equipped Section */}
      {equippedPetIds.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-primary">⚔️ Equipped ({equippedPetIds.length}/3)</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {pets.filter(p => equippedPetIds.includes(p.id)).map(pet => (
              <div key={pet.id} className="relative flex-shrink-0">
                <PetCard
                  pet={pet}
                  onClick={() => onToggleEquip(pet.id)}
                  size="md"
                />
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Pets Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {sortedPets.map(pet => {
          const isEquipped = equippedPetIds.includes(pet.id);
          return (
            <div key={pet.id} className="relative">
              <PetCard
                pet={pet}
                onClick={() => onToggleEquip(pet.id)}
                size="md"
              />
              {isEquipped && (
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-6xl block mb-4">🥚</span>
          <p className="text-xl">No pets collected yet!</p>
        </div>
      )}
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color?: PetRank }) {
  const colorClasses = {
    neon: 'border-neon text-neon',
    diamond: 'border-diamond text-diamond',
    gold: 'border-gold text-gold',
    bronze: 'border-bronze text-bronze',
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border-2 bg-card",
      color ? colorClasses[color] : "border-muted text-foreground"
    )}>
      <span className="font-bold">{value}</span>
      <span className="text-xs ml-1 opacity-70">{label}</span>
    </div>
  );
}
