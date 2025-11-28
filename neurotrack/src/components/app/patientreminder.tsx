"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Volume2, Mic } from "lucide-react";

interface Reminder {
  _id: string;
  text: string;
  time: string; // ISO datetime
}

const API_URL = "http://localhost:5000/reminders";

export function PatientReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Fetch reminders only - no adding
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (Array.isArray(data)) {
          setReminders(data);
        } else {
          setReminders([]);
        }
      } catch (err) {
        console.error("Error fetching reminders:", err);
        setReminders([]);
      }
    };

    fetchReminders();
  }, []);

  // Speak text
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 0.85;
      speechSynthesis.speak(msg);
    }
  };

  const speakAll = () => {
    if (reminders.length === 0) return;
    const combined = reminders.map((r) => r.text).join(". ");
    speak("Here are your reminders. " + combined);
  };

  return (
    <Card className="w-full shadow-xl border border-gray-300 rounded-2xl bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-blue-700">
          Daily Reminders
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Simple reminders to help you through the day
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {/* Reminder List */}
        <ScrollArea className="h-80 w-full pr-4">
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="p-4 bg-blue-100 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-xl font-semibold text-blue-900">
                      {reminder.text}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(reminder.time).toLocaleString()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white border rounded-full shadow-md"
                    onClick={() => speak(reminder.text)}
                  >
                    <Volume2 className="w-6 h-6 text-blue-600" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20 text-xl">
              No reminders available.
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          onClick={speakAll}
          disabled={reminders.length === 0}
          className="w-full text-xl py-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg"
        >
          <Mic className="mr-2 w-6 h-6" />
          Speak All
        </Button>
      </CardFooter>
    </Card>
  );
}
