import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Pet } from '@/types/game';
import { generateWrongAnswers } from '@/data/pets';

interface AnswerBubblesProps {
  pet: Pet;
  onAnswer: (answer: number, timeMs: number) => void;
  onClose: () => void;
}

const bubblePositions = [
  'top-20 left-1/2 -translate-x-1/2',
  'top-1/3 left-8',
  'top-1/3 right-8',
  'bottom-32 left-1/4',
  'bottom-32 right-1/4',
];

export function AnswerBubbles({ pet, onAnswer, onClose }: AnswerBubblesProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const wrong = generateWrongAnswers(pet.fact.answer, 3);
    const all = [...wrong, pet.fact.answer];
    // Shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setAnswers(all);
  }, [pet.fact.answer]);

  const handleAnswer = useCallback((answer: number) => {
    const timeMs = Date.now() - startTime;
    const correct = answer === pet.fact.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    setTimeout(() => {
      onAnswer(answer, timeMs);
    }, correct ? 500 : 1000);
  }, [startTime, pet.fact.answer, onAnswer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-pop">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl"
      >
        ✕
      </button>

      {/* Center: Pet and Problem */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Problem Display */}
        <div className={cn(
          "text-4xl md:text-6xl font-bold px-8 py-4 rounded-2xl border-4",
          isCorrect === true && "bg-success/20 border-success text-success animate-pop",
          isCorrect === false && "bg-destructive/20 border-destructive text-destructive animate-shake",
          isCorrect === null && "bg-card border-primary text-foreground"
        )}>
          {pet.fact.num1} × {pet.fact.num2} = {isCorrect !== null ? pet.fact.answer : '?'}
        </div>

        {/* Pet */}
        <div className={cn(
          "text-8xl transition-transform duration-300",
          isCorrect === false && "animate-shake",
          isCorrect === true && "scale-125"
        )}>
          {pet.emoji}
        </div>

        {/* Result Message */}
        {isCorrect !== null && (
          <div className={cn(
            "text-2xl font-bold animate-pop",
            isCorrect ? "text-success" : "text-destructive"
          )}>
            {isCorrect ? "YUMMY! 🎉" : "FART! 💨"}
          </div>
        )}
      </div>

      {/* Answer Bubbles */}
      {isCorrect === null && answers.map((answer, index) => (
        <button
          key={answer}
          onClick={() => handleAnswer(answer)}
          className={cn(
            "absolute w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
            "text-2xl md:text-3xl font-bold transition-all duration-200",
            "bg-gradient-neon text-foreground border-4 border-foreground/20",
            "hover:scale-110 active:scale-95 glow-primary",
            "animate-float",
            bubblePositions[index]
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {answer}
        </button>
      ))}

      {/* Timer indicator */}
      {isCorrect === null && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="text-sm text-muted-foreground">Tap the correct answer!</div>
        </div>
      )}
    </div>
  );
}
