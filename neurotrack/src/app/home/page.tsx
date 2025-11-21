"use client";

import Link from "next/link";

export default function HomeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">SafePath</h1>
        <nav className="space-x-4">
          <Link href="#features" className="text-gray-700 hover:text-indigo-600">
            Features
          </Link>
          <Link href="#get-started" className="text-gray-700 hover:text-indigo-600">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          Welcome to SafePath
        </h2>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mb-8">
          SafePath helps you manage reminders, track important people, play cognitive games, 
          and navigate locations easily — all in one place.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          id="get-started"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-4">
        <h3 className="text-3xl font-bold text-center text-indigo-600 mb-12">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-indigo-50 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h4 className="text-xl font-semibold mb-2">Reminders</h4>
            <p className="text-gray-600">
              Keep track of important tasks and medications so you never miss a thing.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h4 className="text-xl font-semibold mb-2">People</h4>
            <p className="text-gray-600">
              Manage your family, friends, and caregivers in one organized list.
            </p>
          </div>
          <div className="bg-pink-50 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h4 className="text-xl font-semibold mb-2">Games</h4>
            <p className="text-gray-600">
              Play brain games to stay sharp and improve memory and cognition.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h4 className="text-xl font-semibold mb-2">Location</h4>
            <p className="text-gray-600">
              Track important locations and safe spots easily from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 mt-auto">
        <p className="text-gray-500 text-sm">
          SafePath Memory Aid © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
