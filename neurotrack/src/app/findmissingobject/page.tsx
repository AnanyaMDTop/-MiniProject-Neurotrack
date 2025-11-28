"use client";

import { MissingObjectGame } from "@/components/app/findmissingobject";

export default function MissingObjectGamePage() {
  return (
    <div className="p-6">
      <MissingObjectGame
        onGameComplete={(time) =>
          console.log("Game finished in", time, "seconds")
        }
      />
    </div>
  );
}
