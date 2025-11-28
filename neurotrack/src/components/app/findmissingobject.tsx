"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const allItems = [
  { name: "Toothbrush", img: "/games/toothbrush.png" },
  { name: "Soap", img: "/games/soap.png" },
  { name: "Comb", img: "/games/comb.png" },
  { name: "Glasses", img: "/games/glasses.png" },
  { name: "Keys", img: "/games/keys.png" },
  { name: "Spoon", img: "/games/spoon.png" },
  { name: "Cup", img: "/games/cup.png" },
  { name: "Shoes", img: "/games/shoes.png" },
  { name: "Hat", img: "/games/hat.png" },
  { name: "Wallet", img: "/games/wallet.png" },
];

const speak = (text: string) => {
  if (typeof window !== "undefined") {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    speechSynthesis.speak(utter);
  }
};

type MissingObjectGameProps = {
  onGameComplete?: (timeTaken: number) => void;
};

export function MissingObjectGame({ onGameComplete }: MissingObjectGameProps) {
  const [displayItems, setDisplayItems] = useState<any[]>([]);
  const [missingItem, setMissingItem] = useState<any | null>(null);
  const [result, setResult] = useState<string>("");

  const [startTime, setStartTime] = useState<number>(0);

  const startGame = () => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const missing = shuffled[Math.floor(Math.random() * shuffled.length)];

    setMissingItem(missing);
    setDisplayItems(shuffled.filter((item) => item.name !== missing.name));
    setResult("");
    setStartTime(Date.now());

    speak("Look carefully at the items on the left. One is missing.");
    setTimeout(() => speak("Tap the missing item from the right side."), 2000);
  };

  useEffect(() => startGame(), []);

  const handleGuess = (clickedName: string) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    if (clickedName === missingItem.name) {
      const msg = "Correct! You found the missing item.";
      setResult(msg);
      speak(msg);
    } else {
      const msg = `Oops! The missing item was ${missingItem.name}.`;
      setResult(msg);
      speak(msg);
    }

    if (onGameComplete) onGameComplete(timeTaken);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        🧠 Memory Training – Find the Missing Item
      </h1>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT COLUMN — ITEMS SHOWN */}
        <div className="border p-4 rounded-xl shadow-lg bg-white">
          <h2 className="text-xl font-semibold text-center mb-4">
            Items Shown
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {displayItems.map((item) => (
              <div key={item.name} className="p-3 bg-gray-100 rounded-xl shadow">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="mx-auto"
                />
                <p className="text-center mt-2 font-medium">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — CHOICES */}
        <div className="border p-4 rounded-xl shadow-lg bg-white">
          <h2 className="text-xl font-semibold text-center mb-4">
            Tap the Missing Item
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {allItems.map((item) => (
              <div
                key={item.name}
                className="cursor-pointer p-3 bg-blue-100 hover:bg-blue-200 transition rounded-xl shadow flex flex-col items-center"
                onClick={() => handleGuess(item.name)}
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  width={70}
                  height={70}
                />
                <p className="text-center text-sm mt-2 font-semibold">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {result && (
        <p className="mt-6 text-center text-xl font-bold text-green-700">
          {result}
        </p>
      )}

      <div className="text-center mt-6">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 text-lg font-semibold"
          onClick={startGame}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}
