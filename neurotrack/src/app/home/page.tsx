"use client";

import Link from "next/link";
import { Bell, MapPin, User, Gamepad2, Phone, HeartPulse, Stethoscope, Bot } from "lucide-react";

export default function CaregiverHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">SafePath Caregiver</h1>
        <nav className="space-x-4">
          <Link href="#features" className="text-gray-700 hover:text-purple-600">
            Features
          </Link>
          <Link href="#doctor-chat" className="text-gray-700 hover:text-purple-600">
            Doctor Chat
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-purple-700 mb-3">
          Caregiving Made Easier
        </h2>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mb-8">
          Manage reminders, track the patient's well-being, view important locations, 
          and communicate with doctors — all in one unified dashboard.
        </p>

        <Link
          href="#features"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          Explore Features
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-4">
        <h3 className="text-3xl font-bold text-center text-purple-700 mb-12">
          Caregiver Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Reminders */}
          <Link href="/caregiver/reminders">
            <div className="bg-purple-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <Bell className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Patient Reminders</h4>
              <p className="text-gray-600 text-sm">
                Manage medication, appointments, hydration & activity reminders.
              </p>
            </div>
          </Link>

          {/* Location Tracking */}
          <Link href="/caregiver/location">
            <div className="bg-indigo-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Location Tracking</h4>
              <p className="text-gray-600 text-sm">
                Monitor patient’s live location and safe zones.
              </p>
            </div>
          </Link>

          {/* Patient Profile */}
          <Link href="">
            <div className="bg-pink-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <User className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Patient Profile</h4>
              <p className="text-gray-600 text-sm">View medical history, allergies, and contacts.</p>
            </div>
          </Link>

          {/* Health & Mood Tracking */}
          <Link href="/caregiver/mood">
            <div className="bg-red-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <HeartPulse className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Mood & Health Tracking</h4>
              <p className="text-gray-600 text-sm">
                Track patient mood changes and symptoms.
              </p>
            </div>
          </Link>

          {/* Cognitive Games */}
          <Link href="/games">
            <div className="bg-yellow-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <Gamepad2 className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Cognitive Games</h4>
              <p className="text-gray-600 text-sm">
                Improve memory and cognitive strength with fun brain games.
              </p>
            </div>
          </Link>

          {/* Family Contacts */}
          <Link href="/caregiver/contacts">
            <div className="bg-green-50 p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer text-center">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-xl font-semibold">Important Contacts</h4>
              <p className="text-gray-600 text-sm">
                Quick access to family, doctor, or emergency contacts.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Doctor Interaction / Chatbot */}
      <section
        id="doctor-chat"
        className="bg-gradient-to-r from-purple-100 to-indigo-100 py-16 px-8 text-center"
      >
        <h3 className="text-3xl font-bold text-purple-700 mb-4">
          Talk to the Doctor or AI Health Assistant
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Get instant guidance, share patient updates, and receive medical suggestions 
          directly through the AI-assisted doctor chatbot.
        </p>

        <Link
          href="/doctor-chat"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow text-lg"
        >
          <Bot className="w-6 h-6" /> Start Chat
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 mt-auto">
        <p className="text-gray-500 text-sm">
          SafePath Caregiver Dashboard © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
