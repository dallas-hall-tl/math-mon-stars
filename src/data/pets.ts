import { Pet, MathFact, PetFamily } from '@/types/game';

const petTemplates: Record<PetFamily, { names: string[]; emojis: string[] }> = {
  twos: { names: ['Twin-Pup', 'Double-Dino', 'Pair-Bear'], emojis: ['🐕', '🦖', '🐻'] },
  threes: { names: ['Tri-Cat', 'Triple-Turtle', 'Trio-Bird'], emojis: ['🐱', '🐢', '🐦'] },
  fours: { names: ['Quad-Bunny', 'Four-Fox', 'Square-Sloth'], emojis: ['🐰', '🦊', '🦥'] },
  fives: { names: ['Nickel-Bot', 'Five-Frog', 'Penta-Panda'], emojis: ['🤖', '🐸', '🐼'] },
  sixes: { names: ['Hexa-Hawk', 'Six-Snake', 'Dice-Dragon'], emojis: ['🦅', '🐍', '🐉'] },
  sevens: { names: ['Lucky-Lion', 'Seven-Spider', 'Rainbow-Rex'], emojis: ['🦁', '🕷️', '🦕'] },
  eights: { names: ['Octo-Owl', 'Eight-Elephant', 'Infinity-Imp'], emojis: ['🦉', '🐘', '👿'] },
  nines: { names: ['Nine-Narwhal', 'Cloud-Cat', 'Nova-Newt'], emojis: ['🦄', '😺', '🦎'] },
  tens: { names: ['Rocket-Rex', 'Deca-Dog', 'Ten-Tiger'], emojis: ['🚀', '🐕‍🦺', '🐯'] },
  division: { names: ['Split-Pea', 'Divide-Dino', 'Splitter-Slime'], emojis: ['🫛', '🦕', '🫠'] },
};

function getFamily(num: number): PetFamily {
  const families: Record<number, PetFamily> = {
    2: 'twos', 3: 'threes', 4: 'fours', 5: 'fives',
    6: 'sixes', 7: 'sevens', 8: 'eights', 9: 'nines', 10: 'tens'
  };
  return families[num] || 'fives';
}

function generatePetName(fact: MathFact): string {
  const template = petTemplates[fact.family];
  const baseName = template.names[Math.floor(Math.random() * template.names.length)];
  return `${fact.num1}×${fact.num2} ${baseName}`;
}

function generatePetEmoji(fact: MathFact): string {
  const template = petTemplates[fact.family];
  return template.emojis[Math.floor(Math.random() * template.emojis.length)];
}

export function createMathFact(num1: number, num2: number, operation: 'multiply' | 'divide' = 'multiply'): MathFact {
  const answer = operation === 'multiply' ? num1 * num2 : num1 / num2;
  return {
    id: `${operation}-${num1}-${num2}`,
    operation,
    num1,
    num2,
    answer,
    family: operation === 'divide' ? 'division' : getFamily(Math.min(num1, num2)),
  };
}

export function createPet(fact: MathFact): Pet {
  return {
    id: `pet-${fact.id}`,
    name: generatePetName(fact),
    emoji: generatePetEmoji(fact),
    fact,
    rank: 'bronze',
    hunger: Math.floor(Math.random() * 60) + 20, // 20-80 hunger to start
    lastFed: new Date(Date.now() - Math.random() * 86400000), // random time in last 24h
    stability: 1,
    correctStreak: 0,
    totalAttempts: 0,
    fastCorrects: 0,
  };
}

export function generateStarterPets(): Pet[] {
  const starterFacts: MathFact[] = [
    createMathFact(2, 3),
    createMathFact(2, 5),
    createMathFact(3, 4),
    createMathFact(5, 5),
    createMathFact(6, 7),
    createMathFact(7, 8),
    createMathFact(9, 9),
    createMathFact(4, 6),
  ];
  
  return starterFacts.map(fact => createPet(fact));
}

export function calculateRank(timeMs: number, correct: boolean): 'bronze' | 'gold' | 'diamond' | 'neon' | null {
  if (!correct) return null;
  if (timeMs < 2000) return 'neon';
  if (timeMs < 3000) return 'diamond';
  if (timeMs < 5000) return 'gold';
  return 'bronze';
}

export function generateWrongAnswers(correctAnswer: number, count: number = 3): number[] {
  const wrong: Set<number> = new Set();
  while (wrong.size < count) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const candidate = correctAnswer + offset;
    if (candidate !== correctAnswer && candidate > 0 && !wrong.has(candidate)) {
      wrong.add(candidate);
    }
  }
  return Array.from(wrong);
}
