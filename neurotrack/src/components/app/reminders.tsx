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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Volume2, PlusCircle, Mic } from "lucide-react";

interface Reminder {
  _id: string;
  text: string;
  time: string; // ISO datetime
}

const API_URL = "http://localhost:5000/reminders"; // Adjust if backend runs elsewhere

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState("");
  const [newTime, setNewTime] = useState("");

  // Fetch reminders from backend
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (Array.isArray(data)) {
          setReminders(data);
        } else if (data) {
          setReminders([data]);
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

  // Add new reminder
  const handleAddReminder = async () => {
    const trimmedText = newReminder.trim();
    if (!trimmedText || !newTime) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedText, time: newTime }),
      });

      const data: Reminder = await res.json();
      setReminders((prev) => [data, ...prev]);
      setNewReminder("");
      setNewTime("");
    } catch (err) {
      console.error("Error adding reminder:", err);
    }
  };

  // Delete reminder
  const handleDeleteReminder = async (_id: string) => {
    try {
      await fetch(`${API_URL}/${_id}`, { method: "DELETE" });
      setReminders((prev) => prev.filter((r) => r._id !== _id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  // Speak reminder
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Speak all reminders
  const handleSpeakAll = () => {
    if ("speechSynthesis" in window && reminders.length > 0) {
      const allText = reminders.map((r) => r.text).join(". ");
      handleSpeak(`Here are your reminders. ${allText}`);
    }
  };

  // Browser Notifications
  const triggerNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") new Notification(message);
      });
    }
  };

  // Check for reminder times
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      reminders.forEach((reminder) => {
        const reminderTime = new Date(reminder.time).getTime();
        if (
          reminderTime &&
          Math.abs(reminderTime - now) < 60000 // within 1 min
        ) {
          triggerNotification(`⏰ Reminder: ${reminder.text}`);
        }
      });
    }, 30000); // check every 30 sec

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Daily Reminders</CardTitle>
        <CardDescription>
          Add, manage, and get notified of your reminders.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Reminder Section */}
        <div className="flex flex-col space-y-2">
          <Textarea
            placeholder="e.g., Take medication at 8 AM"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            className="text-base min-h-[60px]"
            rows={2}
          />
          <input
            type="datetime-local"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded"
          />
          <Button onClick={handleAddReminder} className="w-fit">
            <PlusCircle className="h-5 w-5 mr-2" /> Add Reminder
          </Button>
        </div>

        <Separator />

        {/* Reminder List */}
        <ScrollArea className="h-72 w-full pr-4">
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder, index) => (
                <div
                  key={reminder._id || index}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div>
                    <p className="text-base text-secondary-foreground">
                      {reminder.text}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(reminder.time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSpeak(reminder.text)}
                      aria-label={`Speak reminder: ${reminder.text}`}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete reminder: ${reminder.text}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>No reminders yet. Add one above to get started!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSpeakAll}
          disabled={reminders.length === 0}
          className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Mic className="mr-2 h-5 w-5" />
          Speak All Reminders
        </Button>
      </CardFooter>
    </Card>
  );
}
