import { useState, useCallback, useEffect } from 'react';
import { Pet, GameState, PetRank } from '@/types/game';
import { generateStarterPets, calculateRank } from '@/data/pets';

const STORAGE_KEY = 'math-monstars-save';

function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Convert dates back to Date objects
      data.allPets = data.allPets.map((p: Pet) => ({
        ...p,
        lastFed: new Date(p.lastFed),
      }));
      return data;
    }
  } catch (e) {
    console.error('Failed to load game:', e);
  }
  return null;
}

function saveGame(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGame();
    if (saved) return saved;
    return {
      coins: 100,
      equippedPets: [],
      allPets: generateStarterPets(),
      currentZone: 'Multiplication Meadow',
    };
  });

  // Auto-save on change
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  // Decrease hunger over time (simulate FSRS scheduling)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        allPets: prev.allPets.map(pet => {
          // Decrease hunger based on stability (higher stability = slower hunger)
          const hungerDecrease = Math.max(1, 5 - pet.stability);
          return {
            ...pet,
            hunger: Math.max(0, pet.hunger - hungerDecrease),
          };
        }),
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const feedPet = useCallback((petId: string, correct: boolean, timeMs: number) => {
    setGameState(prev => {
      const pet = prev.allPets.find(p => p.id === petId);
      if (!pet) return prev;

      const newRank = calculateRank(timeMs, correct);
      const coinsEarned = correct ? (newRank === 'neon' ? 50 : newRank === 'diamond' ? 30 : newRank === 'gold' ? 15 : 5) : 0;
      
      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        allPets: prev.allPets.map(p => {
          if (p.id !== petId) return p;
          
          if (correct) {
            const newStreak = p.correctStreak + 1;
            const newStability = Math.min(7, p.stability + (newRank === 'neon' ? 1 : 0.5));
            const bestRank = getBetterRank(p.rank, newRank || 'bronze');
            
            return {
              ...p,
              hunger: Math.min(100, p.hunger + 40),
              lastFed: new Date(),
              stability: newStability,
              correctStreak: newStreak,
              totalAttempts: p.totalAttempts + 1,
              fastCorrects: timeMs < 3000 ? p.fastCorrects + 1 : p.fastCorrects,
              rank: bestRank,
            };
          } else {
            return {
              ...p,
              hunger: Math.max(0, p.hunger - 10),
              correctStreak: 0,
              totalAttempts: p.totalAttempts + 1,
              stability: Math.max(0.5, p.stability - 0.5),
            };
          }
        }),
      };
    });
  }, []);

  const toggleEquipPet = useCallback((petId: string) => {
    setGameState(prev => {
      const isEquipped = prev.equippedPets.includes(petId);
      if (isEquipped) {
        return {
          ...prev,
          equippedPets: prev.equippedPets.filter(id => id !== petId),
        };
      } else if (prev.equippedPets.length < 3) {
        return {
          ...prev,
          equippedPets: [...prev.equippedPets, petId],
        };
      }
      return prev;
    });
  }, []);

  const mineBlock = useCallback((petId: string, correct: boolean, timeMs: number): number => {
    let coinsEarned = 0;
    
    setGameState(prev => {
      if (correct) {
        const newRank = calculateRank(timeMs, correct);
        coinsEarned = newRank === 'neon' ? 25 : newRank === 'diamond' ? 15 : newRank === 'gold' ? 8 : 3;
      }
      
      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        allPets: prev.allPets.map(p => {
          if (p.id !== petId) return p;
          
          if (correct) {
            const newRank = calculateRank(timeMs, correct);
            const bestRank = getBetterRank(p.rank, newRank || 'bronze');
            
            return {
              ...p,
              correctStreak: p.correctStreak + 1,
              totalAttempts: p.totalAttempts + 1,
              fastCorrects: timeMs < 3000 ? p.fastCorrects + 1 : p.fastCorrects,
              rank: bestRank,
            };
          } else {
            return {
              ...p,
              correctStreak: 0,
              totalAttempts: p.totalAttempts + 1,
            };
          }
        }),
      };
    });
    
    return coinsEarned;
  }, []);

  const hungryPets = gameState.allPets.filter(p => p.hunger < 50);
  const equippedPets = gameState.allPets.filter(p => gameState.equippedPets.includes(p.id));

  return {
    ...gameState,
    hungryPets,
    equippedPets,
    feedPet,
    toggleEquipPet,
    mineBlock,
  };
}

function getBetterRank(current: PetRank, newRank: PetRank): PetRank {
  const order: PetRank[] = ['bronze', 'gold', 'diamond', 'neon'];
  return order.indexOf(newRank) > order.indexOf(current) ? newRank : current;
}
