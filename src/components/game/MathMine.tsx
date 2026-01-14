import { useState, useEffect } from 'react';
import { Pet } from '@/types/game';
import { AnswerBubbles } from './AnswerBubbles';
import { cn } from '@/lib/utils';

interface MathMineProps {
  equippedPets: Pet[];
  onMineBlock: (petId: string, correct: boolean, timeMs: number) => number;
}

interface MineBlock {
  id: string;
  hp: number;
  maxHp: number;
  gems: number;
  x: number;
  y: number;
}

export function MathMine({ equippedPets, onMineBlock }: MathMineProps) {
  const [blocks, setBlocks] = useState<MineBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<MineBlock | null>(null);
  const [activePet, setActivePet] = useState<Pet | null>(null);
  const [miningAnimation, setMiningAnimation] = useState<string | null>(null);
  const [gemsCollected, setGemsCollected] = useState(0);

  useEffect(() => {
    // Generate mine blocks
    const newBlocks: MineBlock[] = [];
    for (let i = 0; i < 9; i++) {
      newBlocks.push({
        id: `block-${i}`,
        hp: 3,
        maxHp: 3,
        gems: Math.floor(Math.random() * 50) + 10,
        x: (i % 3) * 33 + 16,
        y: Math.floor(i / 3) * 28 + 20,
      });
    }
    setBlocks(newBlocks);
  }, []);

  const handleBlockTap = (block: MineBlock) => {
    if (equippedPets.length === 0) return;
    // Pick a random equipped pet
    const pet = equippedPets[Math.floor(Math.random() * equippedPets.length)];
    setSelectedBlock(block);
    setActivePet(pet);
  };

  const handleAnswer = (answer: number, timeMs: number) => {
    if (!selectedBlock || !activePet) return;
    
    const correct = answer === activePet.fact.answer;
    const coinsEarned = onMineBlock(activePet.id, correct, timeMs);
    
    if (correct) {
      setMiningAnimation(selectedBlock.id);
      setBlocks(prev => prev.map(b => {
        if (b.id === selectedBlock.id) {
          const newHp = b.hp - 1;
          if (newHp <= 0) {
            setGemsCollected(g => g + b.gems);
            // Respawn block after delay
            setTimeout(() => {
              setBlocks(p => p.map(pb => 
                pb.id === b.id 
                  ? { ...pb, hp: pb.maxHp, gems: Math.floor(Math.random() * 50) + 10 }
                  : pb
              ));
            }, 1000);
          }
          return { ...b, hp: newHp };
        }
        return b;
      }));
      setTimeout(() => setMiningAnimation(null), 300);
    }
    
    setSelectedBlock(null);
    setActivePet(null);
  };

  const blockColors = ['from-primary to-secondary', 'from-accent to-gold', 'from-diamond to-primary'];

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      {/* Mine Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">⛏️ The Math Mines</h2>
        <p className="text-muted-foreground">Tap blocks to solve problems & collect gems!</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border-2 border-accent">
          <span className="text-2xl">💎</span>
          <span className="font-bold text-accent">{gemsCollected}</span>
        </div>
      </div>

      {/* Equipped Pets */}
      {equippedPets.length > 0 ? (
        <div className="flex justify-center gap-2 mb-6">
          {equippedPets.slice(0, 3).map(pet => (
            <div 
              key={pet.id}
              className="text-4xl bg-card p-2 rounded-xl border-2 border-primary"
            >
              {pet.emoji}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mb-6 p-4 bg-card rounded-xl border-2 border-muted">
          <p className="text-muted-foreground">No pets equipped! Go to Pet Pen to feed and equip pets.</p>
        </div>
      )}

      {/* Mine Grid */}
      <div className="relative w-full max-w-md mx-auto aspect-square bg-card rounded-2xl border-4 border-border overflow-hidden">
        {/* Cave background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
        
        {blocks.map((block, i) => (
          <button
            key={block.id}
            onClick={() => block.hp > 0 && handleBlockTap(block)}
            disabled={block.hp <= 0 || equippedPets.length === 0}
            className={cn(
              "absolute w-20 h-20 md:w-24 md:h-24 rounded-xl transition-all duration-200",
              block.hp > 0 
                ? `bg-gradient-to-br ${blockColors[i % 3]} hover:scale-105 active:scale-95 cursor-pointer`
                : "bg-muted/30 scale-75 opacity-50",
              miningAnimation === block.id && "animate-shake scale-90"
            )}
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {block.hp > 0 ? (
              <>
                <span className="text-2xl">🪨</span>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {[...Array(block.maxHp)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < block.hp ? "bg-success" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </>
            ) : (
              <span className="text-2xl">💎</span>
            )}
          </button>
        ))}
      </div>

      {/* Answer Overlay */}
      {activePet && (
        <AnswerBubbles
          pet={activePet}
          onAnswer={handleAnswer}
          onClose={() => { setActivePet(null); setSelectedBlock(null); }}
        />
      )}
    </div>
  );
}
