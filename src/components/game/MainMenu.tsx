import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  onPlay: () => void;
}

export function MainMenu({ onPlay }: MainMenuProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [floatingPets, setFloatingPets] = useState<{ emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate floating pets
    const pets = ['🐕', '🦖', '🐱', '🤖', '🦁', '🚀', '🐼', '🦊', '🐉', '🦉'];
    setFloatingPets(
      pets.map((emoji, i) => ({
        emoji,
        x: 5 + (i * 10),
        delay: i * 0.2,
      }))
    );

    // Stagger animations
    setTimeout(() => setShowTitle(true), 300);
    setTimeout(() => setShowButtons(true), 800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4 pt-12">
      {/* Floating background pets */}
      {floatingPets.map((pet, i) => (
        <div
          key={i}
          className="absolute text-4xl md:text-6xl opacity-20 animate-float pointer-events-none"
          style={{
            left: `${pet.x}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${pet.delay}s`,
          }}
        >
          {pet.emoji}
        </div>
      ))}

      {/* Title */}
      <div className={cn(
        "text-center mb-8 transition-all duration-700",
        showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <h1 className="text-5xl md:text-7xl font-bold mb-2">
          <span className="text-gradient-neon">MATH</span>
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="text-accent">MON-STARS</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto">
          Collect, Feed & Battle with your Math Pets! 🐾
        </p>
      </div>

      {/* Decorative pets */}
      <div className={cn(
        "flex gap-4 mb-12 transition-all duration-500 delay-300",
        showTitle ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}>
        {['🦖', '🤖', '🚀'].map((emoji, i) => (
          <div 
            key={i}
            className={cn(
              "text-6xl md:text-8xl animate-bounce-slow",
              i === 1 && "animate-wiggle"
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Play Button */}
      <div className={cn(
        "transition-all duration-500",
        showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <button
          onClick={onPlay}
          className={cn(
            "relative px-12 py-5 text-2xl md:text-3xl font-bold rounded-2xl",
            "bg-gradient-neon text-foreground",
            "border-4 border-foreground/20",
            "hover:scale-105 active:scale-95 transition-transform",
            "glow-primary animate-pulse-glow"
          )}
        >
          🎮 PLAY NOW!
        </button>
      </div>

      {/* Subtitle */}
      <p className={cn(
        "mt-8 text-muted-foreground text-center transition-all duration-500 delay-500",
        showButtons ? "opacity-100" : "opacity-0"
      )}>
        Master multiplication & division through play!
      </p>
    </div>
  );
}
