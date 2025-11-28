"use client";

import { SequenceMemoryGame } from "@/components/app/sequencememory";

export default function SequenceGamePage() {
  return (
    <div className="p-6">
      <SequenceMemoryGame
        onGameComplete={(time, level) =>
          console.log("Finished in", time, "seconds | Level reached:", level)
        }
      />
    </div>
  );
}
