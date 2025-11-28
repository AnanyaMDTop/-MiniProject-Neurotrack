"use client";

import { useState, useEffect } from "react";

interface Props {
  onGameComplete?: (time: number, level: number) => void;
}

const items = [
  { name: "Toothbrush", img: "/games/toothbrush.png" },
  { name: "Soap", img: "/games/soap.png" },
  { name: "Comb", img: "/games/comb.png" },
  { name: "Glass", img: "/games/glasses.png" },
];

export function SequenceMemoryGame({ onGameComplete }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [showing, setShowing] = useState(false);
  const [message, setMessage] = useState("Click START to begin!");
  const [startTime, setStartTime] = useState(0);

  // 🔊 Speak instruction
  function speak(text: string) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    speechSynthesis.speak(msg);
  }

  // 👉 Start Game
  const startGame = () => {
    const first = Math.floor(Math.random() * items.length);
    setSequence([first]);
    setUserInput([]);
    setLevel(1);
    setMessage("Watch carefully...");
    speak("Watch carefully and remember the sequence.");
    setStartTime(Date.now());
    setShowing(true);
  };

  // 👉 Add next random object
  const nextLevel = () => {
    const next = Math.floor(Math.random() * items.length);
    const newSeq = [...sequence, next];
    setSequence(newSeq);
    setUserInput([]);
    setLevel((l) => l + 1);
    setMessage("Watch the new sequence...");
    speak("Watch the new sequence.");
    setShowing(true);
  };

  // 🎥 Play sequence animation
  useEffect(() => {
    if (showing) {
      let i = 0;

      const interval = setInterval(() => {
        highlight(items[sequence[i]].name);
        i++;

        if (i >= sequence.length) {
          clearInterval(interval);
          setShowing(false);
          setMessage("Now repeat the sequence.");
          speak("Now repeat the sequence.");
        }
      }, 1000);
    }
  }, [showing]);

  // ✨ Highlight animation
  const highlight = (name: string) => {
    const el = document.getElementById(name);
    if (!el) return;

    el.classList.add("scale-125", "bg-yellow-200");
    setTimeout(() => el.classList.remove("scale-125", "bg-yellow-200"), 500);
  };

  // 🖱 User clicking items
  const handleUserClick = (index: number) => {
    if (showing) return;

    const newInput = [...userInput, index];
    setUserInput(newInput);
    highlight(items[index].name);

    // ❌ Wrong click
    if (sequence[newInput.length - 1] !== index) {
      setMessage("Wrong! Game Over. Click Start to play again.");
      speak("Wrong. Game over.");

      if (onGameComplete) {
        onGameComplete((Date.now() - startTime) / 1000, level);
      }
      return;
    }

    // 🎉 Completed sequence correctly
    if (newInput.length === sequence.length) {
      setMessage("Correct! Next level...");
      speak("Correct. Get ready for next level.");

      setTimeout(() => nextLevel(), 1500);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">

      {/* LEFT SIDE — ALL ITEMS */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Available Items</h2>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border p-3 rounded-xl shadow text-center"
            >
              <img src={item.img} className="w-20 mx-auto" />
              <p className="mt-2">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — GAME AREA */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Sequence Memory Game</h2>

        <button
          onClick={startGame}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow mb-4"
        >
          START
        </button>

        <h3 className="text-xl font-semibold mb-2">Level: {level}</h3>

        <p className="mb-4 text-lg font-medium">{message}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {items.map((item, i) => (
            <button
              key={i}
              id={item.name}
              onClick={() => handleUserClick(i)}
              className="border p-4 rounded-xl hover:scale-110 transition shadow"
            >
              <img src={item.img} className="w-24 mx-auto" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
