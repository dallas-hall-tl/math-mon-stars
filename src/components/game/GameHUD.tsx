import { Coins, Zap, Star } from 'lucide-react';

interface GameHUDProps {
  coins: number;
  streak: number;
  zone: string;
}

export function GameHUD({ coins, streak, zone }: GameHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
        {/* Coins */}
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-accent glow-gold">
          <Coins className="w-5 h-5 text-accent" />
          <span className="font-bold text-accent">{coins.toLocaleString()}</span>
        </div>

        {/* Zone */}
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-primary">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">{zone}</span>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-secondary glow-secondary animate-pop">
            <Zap className="w-5 h-5 text-secondary" />
            <span className="font-bold text-secondary">×{streak}</span>
          </div>
        )}
      </div>
    </div>
  );
}
