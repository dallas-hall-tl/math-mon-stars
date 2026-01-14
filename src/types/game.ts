export type PetRank = 'bronze' | 'gold' | 'diamond' | 'neon';

export type PetFamily = 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'sevens' | 'eights' | 'nines' | 'tens' | 'division';

export interface MathFact {
  id: string;
  operation: 'multiply' | 'divide';
  num1: number;
  num2: number;
  answer: number;
  family: PetFamily;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  fact: MathFact;
  rank: PetRank;
  hunger: number; // 0-100, 100 = full, 0 = starving
  lastFed: Date;
  stability: number; // FSRS stability (days until hungry)
  correctStreak: number;
  totalAttempts: number;
  fastCorrects: number; // answers under 3 seconds
}

export interface GameState {
  coins: number;
  equippedPets: string[];
  allPets: Pet[];
  currentZone: string;
}

export interface AnswerResult {
  correct: boolean;
  timeMs: number;
  newRank?: PetRank;
  coinsEarned: number;
}
