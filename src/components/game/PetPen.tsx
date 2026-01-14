import { useState } from 'react';
import { Pet } from '@/types/game';
import { PetCard } from './PetCard';
import { AnswerBubbles } from './AnswerBubbles';
import { calculateRank } from '@/data/pets';

interface PetPenProps {
  pets: Pet[];
  onPetFed: (petId: string, correct: boolean, timeMs: number) => void;
}

export function PetPen({ pets, onPetFed }: PetPenProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const hungryPets = pets.filter(p => p.hunger < 50).sort((a, b) => a.hunger - b.hunger);
  const satisfiedPets = pets.filter(p => p.hunger >= 50);

  const handleAnswer = (answer: number, timeMs: number) => {
    if (!selectedPet) return;
    const correct = answer === selectedPet.fact.answer;
    onPetFed(selectedPet.id, correct, timeMs);
    setTimeout(() => setSelectedPet(null), correct ? 500 : 1000);
  };

  return (
    <div className="p-4 pb-24">
      {/* Hungry Pets Section */}
      {hungryPets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-destructive">🍖</span> Hungry Pets!
            <span className="text-sm font-normal text-muted-foreground">
              ({hungryPets.length} need feeding)
            </span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {hungryPets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                isHungry
                showProblem={pet.hunger < 30}
                onClick={() => setSelectedPet(pet)}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Satisfied Pets Section */}
      {satisfiedPets.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>😊</span> Happy Pets
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {satisfiedPets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => setSelectedPet(pet)}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-6xl block mb-4">🥚</span>
          <p className="text-xl">No pets yet! Start mining to find some!</p>
        </div>
      )}

      {/* Answer Overlay */}
      {selectedPet && (
        <AnswerBubbles
          pet={selectedPet}
          onAnswer={handleAnswer}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
}
