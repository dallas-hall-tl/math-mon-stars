import { Home, Pickaxe, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GameScreen = 'pen' | 'mine' | 'collection' | 'leaderboard';

interface BottomNavProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  hungryCount: number;
}

const navItems: { screen: GameScreen; icon: typeof Home; label: string }[] = [
  { screen: 'pen', icon: Home, label: 'Pet Pen' },
  { screen: 'mine', icon: Pickaxe, label: 'Mine' },
  { screen: 'collection', icon: Users, label: 'Pets' },
  { screen: 'leaderboard', icon: Trophy, label: 'Ranks' },
];

export function BottomNav({ currentScreen, onNavigate, hungryCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = currentScreen === screen;
          const showBadge = screen === 'pen' && hungryCount > 0;

          return (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                isActive 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6", isActive && "animate-pop")} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {hungryCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
