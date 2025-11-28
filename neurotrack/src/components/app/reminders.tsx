"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, PlusCircle } from "lucide-react";

interface Reminder {
  _id: string;
  text: string;
  time: string;
}

const API_URL = "http://localhost:5000/reminders"; // Your backend API

export function CaregiverRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState("");
  const [newTime, setNewTime] = useState("");

  // Fetch reminders on load
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setReminders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching reminders:", err);
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
  const handleDeleteReminder = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <Card className="w-full max-w-5xl shadow-xl rounded-3xl border bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-700">
            Caregiver Reminders
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Add and manage reminders for the patient easily.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Add Reminder Section */}
          <div className="space-y-4 bg-purple-50 p-5 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800">
              Add a New Reminder
            </h3>

            <Textarea
              placeholder="Enter reminder text..."
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              className="text-base min-h-[70px] bg-white"
            />

            <input
              type="datetime-local"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="border p-3 rounded-xl w-full bg-white text-gray-700"
            />

            <Button
              onClick={handleAddReminder}
              className="w-full py-5 text-lg bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="h-6 w-6 mr-2" />
              Add Reminder
            </Button>
          </div>

          <Separator />

          {/* Reminder List */}
          <h3 className="text-xl font-semibold text-gray-700">All Reminders</h3>

          <ScrollArea className="h-96 pr-4">
            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-sm border"
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        {reminder.text}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(reminder.time).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      className="rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 text-lg">
                No reminders added yet.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

