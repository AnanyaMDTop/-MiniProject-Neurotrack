"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Puzzle, Trophy, Eye } from "lucide-react";
import { MemoryGame } from "./memory-game";
import { TicTacToeGame } from "./tic-tac-toe-game";
import { Scoreboard, type Score } from "./scoreboard";
import { ImageGuessingGame } from "./image-guessing-game";

export function GamesFeature() {
    const [scores, setScores] = useState<Score[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedScores = localStorage.getItem("memoryGameScores");
        if (storedScores) {
            setScores(JSON.parse(storedScores));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("memoryGameScores", JSON.stringify(scores));
        }
    }, [scores, isClient]);


    const handleGameComplete = (time: number) => {
        const newScore: Score = {
            date: new Date().toISOString(),
            time,
        };
        setScores(prevScores => [...prevScores, newScore]);
    }

    return (
         <Tabs defaultValue="memory" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="memory">
              <Puzzle className="mr-2 h-4 w-4" />
              Memory Match
            </TabsTrigger>
            <TabsTrigger value="tictactoe">
              <Brain className="mr-2 h-4 w-4" />
              Tic-Tac-Toe
            </TabsTrigger>
            <TabsTrigger value="image-guesser">
              <Eye className="mr-2 h-4 w-4" />
              Image Guesser
            </TabsTrigger>
            <TabsTrigger value="scoreboard">
                <Trophy className="mr-2 h-4 w-4" />
                Scoreboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="memory" className="mt-6">
            <MemoryGame onGameComplete={handleGameComplete} />
          </TabsContent>
          <TabsContent value="tictactoe" className="mt-6">
            <TicTacToeGame />
          </TabsContent>
          <TabsContent value="image-guesser" className="mt-6">
            <ImageGuessingGame />
          </TabsContent>
           <TabsContent value="scoreboard" className="mt-6">
            <Scoreboard scores={scores} />
          </TabsContent>
        </Tabs>
    )
}
