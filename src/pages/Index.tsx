import { useState } from 'react';
import { MainMenu } from '@/components/game/MainMenu';
import { PetPen } from '@/components/game/PetPen';
import { MathMine } from '@/components/game/MathMine';
import { PetCollection } from '@/components/game/PetCollection';
import { Leaderboard } from '@/components/game/Leaderboard';
import { GameHUD } from '@/components/game/GameHUD';
import { BottomNav, GameScreen } from '@/components/game/BottomNav';
import { useGameState } from '@/hooks/useGameState';

export default function Index() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('pen');
  const [streak, setStreak] = useState(0);

  const {
    coins,
    allPets,
    equippedPets,
    hungryPets,
    currentZone,
    feedPet,
    toggleEquipPet,
    mineBlock,
    equippedPets: equippedPetsList,
  } = useGameState();

  const handlePetFed = (petId: string, correct: boolean, timeMs: number) => {
    feedPet(petId, correct, timeMs);
    if (correct) {
      setStreak(s => s + 1);
      setTimeout(() => setStreak(0), 5000);
    } else {
      setStreak(0);
    }
  };

  const handleMineBlock = (petId: string, correct: boolean, timeMs: number) => {
    const coinsEarned = mineBlock(petId, correct, timeMs);
    if (correct) {
      setStreak(s => s + 1);
      setTimeout(() => setStreak(0), 5000);
    } else {
      setStreak(0);
    }
    return coinsEarned;
  };

  if (!isPlaying) {
    return <MainMenu onPlay={() => setIsPlaying(true)} />;
  }

  return (
    <div className="min-h-screen">
      <GameHUD coins={coins} streak={streak} zone={currentZone} />
      
      {currentScreen === 'pen' && (
        <div className="pt-16">
          <PetPen pets={allPets} onPetFed={handlePetFed} />
        </div>
      )}
      
      {currentScreen === 'mine' && (
        <MathMine equippedPets={equippedPets} onMineBlock={handleMineBlock} />
      )}
      
      {currentScreen === 'collection' && (
        <PetCollection 
          pets={allPets} 
          equippedPetIds={equippedPetsList.map(p => p.id)} 
          onToggleEquip={toggleEquipPet}
        />
      )}
      
      {currentScreen === 'leaderboard' && (
        <Leaderboard pets={allPets} />
      )}

      <BottomNav 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen}
        hungryCount={hungryPets.length}
      />
    </div>
  );
}
