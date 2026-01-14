import { Pet } from '@/types/game';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
  isHungry?: boolean;
  showProblem?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rankStyles = {
  bronze: 'border-bronze bg-bronze/10',
  gold: 'border-gold bg-gold/10 glow-gold',
  diamond: 'border-diamond bg-diamond/10 shadow-[0_0_25px_hsl(200_100%_70%/0.5)]',
  neon: 'border-neon bg-neon/10 glow-neon animate-pulse-glow',
};

const rankBadgeStyles = {
  bronze: 'bg-bronze',
  gold: 'bg-gradient-gold',
  diamond: 'bg-gradient-diamond',
  neon: 'bg-gradient-neon',
};

const sizeStyles = {
  sm: 'w-24 h-28',
  md: 'w-32 h-36',
  lg: 'w-40 h-44',
};

const emojiSizes = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-6xl',
};

export function PetCard({ pet, onClick, isHungry, showProblem, size = 'md' }: PetCardProps) {
  const hungerPercent = pet.hunger;
  const hungerColor = hungerPercent > 60 ? 'bg-success' : hungerPercent > 30 ? 'bg-accent' : 'bg-destructive';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border-4 p-3 transition-all duration-300 flex flex-col items-center justify-center gap-1',
        rankStyles[pet.rank],
        sizeStyles[size],
        isHungry && 'animate-wiggle',
        onClick && 'hover:scale-105 cursor-pointer active:scale-95',
      )}
    >
      {/* Rank Badge */}
      <div className={cn(
        'absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase',
        rankBadgeStyles[pet.rank],
        pet.rank === 'neon' ? 'text-foreground' : 'text-primary-foreground'
      )}>
        {pet.rank}
      </div>

      {/* Pet Emoji */}
      <span className={cn(emojiSizes[size], isHungry && 'animate-bounce-slow')}>
        {pet.emoji}
      </span>

      {/* Problem Speech Bubble */}
      {showProblem && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap animate-pop">
          {pet.fact.num1} × {pet.fact.num2} = ?
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-foreground" />
        </div>
      )}

      {/* Hunger Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full transition-all duration-500 rounded-full', hungerColor)}
          style={{ width: `${hungerPercent}%` }}
        />
      </div>

      {/* Pet Name */}
      <span className="text-xs font-medium text-center leading-tight truncate w-full">
        {pet.fact.num1}×{pet.fact.num2}
      </span>
    </button>
  );
}
