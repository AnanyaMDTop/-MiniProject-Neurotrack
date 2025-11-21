"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

type GameState = "playing" | "correct" | "incorrect";

export function ImageGuessingGame() {
  const [currentImage, setCurrentImage] = useState<ImagePlaceholder | null>(null);
  const [guess, setGuess] = useState("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showHint, setShowHint] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    loadNewImage();
  }, []);

  const loadNewImage = () => {
    // This check ensures we don't run this on the server
    if (typeof window !== "undefined") {
        const randomIndex = Math.floor(Math.random() * PlaceHolderImages.length);
        setCurrentImage(PlaceHolderImages[randomIndex]);
    }
    setGuess("");
    setGameState("playing");
    setShowHint(false);
  };

  const handleGuess = () => {
    if (!guess.trim() || !currentImage) return;

    const isCorrect = guess.trim().toLowerCase() === currentImage.imageHint.toLowerCase();

    if (isCorrect) {
      setGameState("correct");
    } else {
      setGameState("incorrect");
    }
  };

  if (!isClient || !currentImage) {
    return (
      <Card className="w-full shadow-lg flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </Card>
    );
  }
  
  const getAlert = () => {
    if (gameState === 'correct') {
      return (
        <Alert variant="default" className="bg-green-100 border-green-300">
            <CheckCircle className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-800">Correct!</AlertTitle>
            <AlertDescription className="text-green-700">
                Great job! You guessed it right.
            </AlertDescription>
        </Alert>
      )
    }
    if (gameState === 'incorrect') {
        return (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Quite!</AlertTitle>
                <AlertDescription>
                    That's a good try, but not correct. Try again!
                </AlertDescription>
            </Alert>
        )
    }
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">What's in the Picture?</CardTitle>
        <CardDescription>
          Look at the image and type your guess below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.description}
            fill
            className="object-contain"
            data-ai-hint={currentImage.imageHint}
          />
        </div>
        
        {getAlert()}

        <div className="space-y-2">
          <Label htmlFor="guess-input" className="text-base">Your Guess:</Label>
          <div className="flex space-x-2">
            <Input
              id="guess-input"
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="e.g., cat, car, tree..."
              disabled={gameState === "correct"}
              className="text-lg h-12"
            />
            <Button 
                onClick={handleGuess} 
                disabled={gameState === "correct" || !guess.trim()}
                className="h-12 text-lg"
            >
                Guess
            </Button>
          </div>
        </div>

        {showHint && (
             <Alert variant="default" className="bg-blue-100 border-blue-300">
                <Lightbulb className="h-4 w-4 text-blue-700" />
                <AlertTitle className="text-blue-800">Hint</AlertTitle>
                <AlertDescription className="text-blue-700">
                    The image shows: {currentImage.description}
                </AlertDescription>
            </Alert>
        )}

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
         <Button 
            onClick={() => setShowHint(true)} 
            variant="outline"
            className="w-full"
            disabled={showHint}
        >
            <Lightbulb className="mr-2 h-5 w-5" />
            Show Hint
        </Button>
        <Button onClick={loadNewImage} className="w-full text-lg py-6 sm:py-4">
          <RefreshCw className="mr-2 h-5 w-5" />
          Next Picture
        </Button>
      </CardFooter>
    </Card>
  );
}
