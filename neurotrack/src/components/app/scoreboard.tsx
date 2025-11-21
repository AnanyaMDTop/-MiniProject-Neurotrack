"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Clock } from "lucide-react";

export interface Score {
  date: string;
  time: number; // in seconds
}

interface ScoreboardProps {
  scores: Score[];
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function Scoreboard({ scores }: ScoreboardProps) {

  const sortedScores = [...scores].sort((a, b) => a.time - b.time);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
            <Trophy className="mr-2 text-yellow-500" />
            Memory Game Scoreboard
        </CardTitle>
        <CardDescription>Your top 5 fastest completion times.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedScores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right flex items-center justify-end">
                    <Clock className="mr-2 h-4 w-4" /> Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScores.slice(0, 5).map((score, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {index + 1}
                      {index === 0 && <Trophy className="ml-2 h-4 w-4 text-yellow-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{formatTime(score.time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No scores yet. Play a game to see your results!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
