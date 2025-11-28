"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Brain, CalendarDays, MapPin, User } from "lucide-react";

export default function PatientHomePage() {
  const performanceData = [
    { day: "Mon", score: 40 },
    { day: "Tue", score: 50 },
    { day: "Wed", score: 55 },
    { day: "Thu", score: 60 },
    { day: "Fri", score: 70 },
    { day: "Sat", score: 65 },
    { day: "Sun", score: 75 },
  ];

  const memoryGames = [
    {
      name: "Match the Cards",
      image: "/games/matchthecard.png",
      description: "Flip cards and match the identical ones.",
      link: "/matchthecard",
    },
    {
      name: "Find the Missing Object",
      image: "/games/finding the missing object.png",
      description: "Identify which object is missing.",
      link: "/findmissingobject",
    },
    {
      name: "Sequence Memory",
      image: "/games/sequencememory.png",
      description: "Remember and repeat the shown sequence.",
      link: "/sequencememory",
    },
    {
      name: "Face Recognition",
      image: "/games/facerecognition.png",
      description: "Identify familiar faces from memory.",
      link: "/patient/games/face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-indigo-700 text-center mb-6">
        Welcome Back 👋
      </h1>
      <p className="text-center text-gray-600 text-lg mb-10">
        We are here to help you stay safe, remember better, and enjoy activities.
      </p>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <Link href="/sequencememory">
          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer text-center">
            <Brain className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">Memory Games</h3>
            <p className="text-gray-500 text-sm">Play games to strengthen memory</p>
          </div>
        </Link>

        <Link href="/patient/reminders">
          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer text-center">
            <CalendarDays className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">Reminders</h3>
            <p className="text-gray-500 text-sm">See today’s important reminders</p>
          </div>
        </Link>

        <Link href="/patient/locations">
          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer text-center">
            <MapPin className="w-10 h-10 text-pink-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">Safe Locations</h3>
            <p className="text-gray-500 text-sm">View important safe places</p>
          </div>
        </Link>

        <Link href="/patient/people">
          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer text-center">
            <User className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">People</h3>
            <p className="text-gray-500 text-sm">Recognize and connect with loved ones</p>
          </div>
        </Link>

      </div>

      {/* 🎮 Memory Games Section */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Memory Games 🎮</h2>
        <p className="text-gray-600 mb-6">Choose a game to exercise your brain.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {memoryGames.map((game, index) => (
            <Link href={game.link} key={index}>
              <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
                <Image
                  src={game.image}
                  width={200}
                  height={150}
                  alt={game.name}
                  className="rounded-lg mx-auto mb-3 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
                <p className="text-gray-500 text-sm">{game.description}</p>
              </div>
            </Link>
          ))}

        </div>
      </div>

      {/* Memory Games Progress Graph */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Memory Game Progress 📊</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recognition Gallery */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Recognize These People 🧑‍🤝‍🧑</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ImageCard src="/recognition/mom.png" label="Mom" />
          <ImageCard src="/recognition/dad.png" label="Dad" />
          <ImageCard src="/recognition/doctor.png" label="Doctor" />
        </div>
      </div>

    </div>
  );
}

function ImageCard({ src, label }: any) {
  return (
    <div className="text-center">
      <Image
        src={src}
        width={200}
        height={200}
        alt={label}
        className="rounded-xl shadow-lg mx-auto hover:scale-110 transition"
      />
      <p className="mt-3 font-semibold text-gray-700 text-lg">{label}</p>
    </div>
  );
}
