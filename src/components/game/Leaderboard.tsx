import { Pet, PetRank } from '@/types/game';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  pets: Pet[];
}

const rankColors: Record<PetRank, string> = {
  neon: 'text-neon',
  diamond: 'text-diamond',
  gold: 'text-gold',
  bronze: 'text-bronze',
};

export function Leaderboard({ pets }: LeaderboardProps) {
  const sortedPets = [...pets]
    .sort((a, b) => {
      // Sort by: rank (neon first), then by streak, then by fast corrects
      const rankOrder: PetRank[] = ['neon', 'diamond', 'gold', 'bronze'];
      const rankDiff = rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
      if (rankDiff !== 0) return rankDiff;
      if (b.correctStreak !== a.correctStreak) return b.correctStreak - a.correctStreak;
      return b.fastCorrects - a.fastCorrects;
    })
    .slice(0, 10);

  const topPets = sortedPets.slice(0, 3);
  const restPets = sortedPets.slice(3);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🏆 Hall of Fame</h2>
        <p className="text-muted-foreground">Your strongest math pets!</p>
      </div>

      {/* Top 3 Podium */}
      {topPets.length > 0 && (
        <div className="flex justify-center items-end gap-2 mb-8">
          {/* 2nd Place */}
          {topPets[1] && (
            <div className="flex flex-col items-center animate-pop" style={{ animationDelay: '0.1s' }}>
              <span className="text-4xl mb-2">{topPets[1].emoji}</span>
              <div className="w-20 h-24 bg-card rounded-t-xl border-2 border-muted flex flex-col items-center justify-center">
                <span className="text-2xl">🥈</span>
                <span className={cn("text-sm font-bold", rankColors[topPets[1].rank])}>
                  {topPets[1].rank.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topPets[0] && (
            <div className="flex flex-col items-center animate-pop">
              <span className="text-5xl mb-2 animate-bounce-slow">{topPets[0].emoji}</span>
              <div className="w-24 h-32 bg-gradient-gold rounded-t-xl border-2 border-gold flex flex-col items-center justify-center glow-gold">
                <span className="text-3xl">🥇</span>
                <span className={cn("text-sm font-bold", rankColors[topPets[0].rank])}>
                  {topPets[0].rank.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topPets[2] && (
            <div className="flex flex-col items-center animate-pop" style={{ animationDelay: '0.2s' }}>
              <span className="text-4xl mb-2">{topPets[2].emoji}</span>
              <div className="w-20 h-20 bg-card rounded-t-xl border-2 border-bronze flex flex-col items-center justify-center">
                <span className="text-2xl">🥉</span>
                <span className={cn("text-sm font-bold", rankColors[topPets[2].rank])}>
                  {topPets[2].rank.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard List */}
      <div className="max-w-md mx-auto space-y-2">
        {restPets.map((pet, index) => (
          <div
            key={pet.id}
            className="flex items-center gap-4 bg-card p-3 rounded-xl border-2 border-border animate-pop"
            style={{ animationDelay: `${(index + 3) * 0.05}s` }}
          >
            <span className="text-lg font-bold text-muted-foreground w-6">
              #{index + 4}
            </span>
            <span className="text-3xl">{pet.emoji}</span>
            <div className="flex-1">
              <div className="font-bold">
                {pet.fact.num1} × {pet.fact.num2}
              </div>
              <div className="text-xs text-muted-foreground">
                Streak: {pet.correctStreak} | Fast: {pet.fastCorrects}
              </div>
            </div>
            <span className={cn("font-bold text-sm uppercase", rankColors[pet.rank])}>
              {pet.rank}
            </span>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-6xl block mb-4">🏆</span>
          <p className="text-xl">No rankings yet!</p>
          <p>Start feeding your pets to rank them up!</p>
        </div>
      )}
    </div>
  );
}
