"use client";

import { MatchTheCard} from "@/components/app/matchthecard";

export default function MatchTheCardPage() {
  return (
    <div className="p-6">
      <MatchTheCard onGameComplete={(time) => console.log("Game finished in", time, "seconds")} />
    </div>
  );
}
