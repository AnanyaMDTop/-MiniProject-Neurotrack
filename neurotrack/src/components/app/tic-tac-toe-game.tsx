"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, X, Circle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"


type Player = "X" | "O";
type SquareValue = Player | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function TicTacToeGame() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);

  const checkWinner = (currentBoard: SquareValue[]): Player | "draw" | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every(square => square !== null)) {
      return "draw";
    }
    return null;
  };
  
  const handlePlayerMove = (index: number) => {
    if (board[index] || winner || currentPlayer === "O") return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer("O");
    }
  };
  
  const handleAIMove = (currentBoard: SquareValue[]): number => {
    // 1. Check if AI can win
    for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
            const tempBoard = [...currentBoard];
            tempBoard[i] = "O";
            if (checkWinner(tempBoard) === "O") return i;
        }
    }
    // 2. Check if Player can win and block
    for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
            const tempBoard = [...currentBoard];
            tempBoard[i] = "X";
            if (checkWinner(tempBoard) === "X") return i;
        }
    }
    // 3. Take center if available
    if (!currentBoard[4]) return 4;
    // 4. Take a random corner
    const corners = [0, 2, 6, 8].filter(i => !currentBoard[i]);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    // 5. Take a random side
    const sides = [1, 3, 5, 7].filter(i => !currentBoard[i]);
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    
    return -1; // Should not happen
  };


  useEffect(() => {
    if (currentPlayer === "O" && !winner) {
      const timeout = setTimeout(() => {
        const bestMove = handleAIMove(board);
        if (bestMove !== -1) {
            const newBoard = [...board];
            newBoard[bestMove] = "O";
            setBoard(newBoard);
            
            const gameWinner = checkWinner(newBoard);
            if(gameWinner) {
                setWinner(gameWinner);
            } else {
                setCurrentPlayer("X");
            }
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, board, winner]);

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };
  
  const getWinnerMessage = () => {
    if (!winner) return null;
    if (winner === "draw") return "It's a draw!";
    return winner === "X" ? "You won!" : "Computer won!";
  }
  
  const Square = ({ value, onClick }: { value: SquareValue; onClick: () => void }) => (
    <button
      className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary flex items-center justify-center rounded-lg shadow-inner disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!!value || !!winner}
      aria-label={`Square ${value || 'empty'}`}
    >
      {value === "X" && <X className="w-12 h-12 text-blue-500" />}
      {value === "O" && <Circle className="w-12 h-12 text-red-500" />}
    </button>
  );

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Tic-Tac-Toe</CardTitle>
        <CardDescription>Play against the computer.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="flex justify-between w-full items-center p-3 bg-secondary rounded-lg">
            <p className="text-lg font-medium">
                {winner ? `Game Over` : `Turn: ${currentPlayer === 'X' ? 'You (X)' : 'Computer (O)'}`}
            </p>
          <Button onClick={restartGame} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
            {board.map((value, index) => (
                <Square key={index} value={value} onClick={() => handlePlayerMove(index)} />
            ))}
        </div>
        
        <AlertDialog open={!!winner} onOpenChange={(open) => !open && restartGame()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-2xl">
                       {winner === 'X' && <Trophy className="mr-2 text-yellow-500" />}
                       {getWinnerMessage()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Play another round to keep your mind sharp!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction onClick={restartGame}>
                    Play Again
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  );
}
