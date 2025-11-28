"use client";

import { useState, useEffect, useRef } from "react";
import { LoginPage } from "@/components/app/auth/LoginPage";
import { Header } from "@/components/app/header";
import { CaregiverRemindersPage } from "@/components/app/reminders";
import { LocationFeature } from "@/components/app/location-feature";
import { GamesFeature } from "@/components/app/games-feature";
import { Bot, Gamepad2, MapPin, Users, Menu, LogOut } from "lucide-react";
import Link from "next/link";

// ✅ Define sidebar items
const navItems = [
    { value: "home", label: "Home", icon: Users, link: "/home" },
  { value: "reminders", label: "Reminders", icon: Bot, component: <CaregiverRemindersPage /> },
  { value: "games", label: "Games", icon: Gamepad2, component: <GamesFeature /> },
  { value: "location", label: "Location", icon: MapPin, component: <LocationFeature /> },
  { value: "people", label: "People", icon: Users, link: "/people" },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("reminders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Click outside sidebar to collapse
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Logout handler
  const handleLogout = () => {
    // Optional: send delete request to backend if you want to remove user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Show login page if no user
  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static z-20 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between md:justify-center border-b">
          <h2 className="sticky top-0 z-50 bg-white shadow-md text-lg font-bold text-indigo-600">
            SafePath
          </h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) =>
            item.link ? (
              <Link
                key={item.value}
                href={item.link}
                className="flex items-center p-3 rounded-lg hover:bg-indigo-100 text-gray-700"
              >
                <item.icon className="mr-3 h-5 w-5 text-indigo-600" />
                {item.label}
              </Link>
            ) : (
              <button
                key={item.value}
                onClick={() => {
                  setActiveTab(item.value);
                  setSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg ${
                  activeTab === item.value
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-100 text-gray-700"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            )
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg mt-4 text-red-600 hover:bg-red-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white shadow-md">
          <Header />
        </div>

        {/* Mobile Menu Button */}
        <div className="p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center p-2 bg-indigo-600 text-white rounded-lg shadow"
          >
            <Menu className="mr-2 h-5 w-5" />
            Menu
          </button>
        </div>

        {/* Dashboard Content */}
        <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
          {navItems.map(
            (item) =>
              item.component &&
              activeTab === item.value && <div key={item.value}>{item.component}</div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>SafePath Memory Aid © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
