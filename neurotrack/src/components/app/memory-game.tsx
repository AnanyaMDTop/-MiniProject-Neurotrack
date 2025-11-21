"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Apple,
  Banana,
  Carrot,
  Cherry,
  Grape,
  Pizza,
  Milk,
  Cookie,
  LucideIcon,
  RotateCcw,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  Apple,
  Banana,
  Carrot,
  Cherry,
  Grape,
  Pizza,
  Milk,
  Cookie,
];

interface CardData {
  id: number;
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

const createShuffledDeck = (): CardData[] => {
  const duplicatedIcons = [...ICONS, ...ICONS];
  const shuffled = duplicatedIcons.sort(() => Math.random() - 0.5);
  return shuffled.map((Icon, index) => ({
    id: index,
    icon: Icon,
    isFlipped: false,
    isMatched: false,
  }));
};

interface MemoryGameProps {
    onGameComplete: (time: number) => void;
}


export function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<CardData[]>(createShuffledDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const startGame = () => {
    setStartTime(Date.now());
    setIsGameRunning(true);
  };
  
   useEffect(() => {
    if (isGameRunning) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isGameRunning, startTime]);

  useEffect(() => {
    const allMatched = cards.every((c) => c.isMatched);
    if (allMatched && isGameRunning) {
      setIsGameRunning(false);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - (startTime ?? endTime)) / 1000);
      onGameComplete(timeTaken);
    }
  }, [cards, isGameRunning, startTime, onGameComplete]);


  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        setCards((prev) =>
          prev.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1200);
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index: number) => {
    if (!isGameRunning) {
        startGame();
    }
    
    if (
      isChecking ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length === 2
    ) {
      return;
    }
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  const restartGame = () => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMoves(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsGameRunning(false);
  };
  
  const allMatched = cards.every(c => c.isMatched);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Memory Match Game</CardTitle>
        <CardDescription>
          Match the pairs to stimulate your mind.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="flex justify-between w-full items-center p-3 bg-secondary rounded-lg">
          <p className="text-lg font-medium">Moves: {moves}</p>
          <div className="flex items-center text-lg font-medium">
            <Timer className="mr-2 h-5 w-5" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
          <Button onClick={restartGame} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
        {allMatched ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <h3 className="text-2xl font-bold text-primary">Congratulations!</h3>
            <p className="text-muted-foreground mt-2">You matched all the pairs in {moves} moves and {formatTime(elapsedTime)}.</p>
            <Button onClick={restartGame} className="mt-4">Play Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="w-20 h-20 sm:w-24 sm:h-24 perspective-1000"
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={cn(
                    "relative w-full h-full transform-style-3d transition-transform duration-500",
                    (card.isFlipped || card.isMatched) && "rotate-y-180"
                  )}
                >
                  <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-secondary rounded-lg cursor-pointer">
                    {/* Back of card */}
                  </div>
                  <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg rotate-y-180 bg-primary text-primary-foreground">
                    <card.icon className="w-10 h-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
