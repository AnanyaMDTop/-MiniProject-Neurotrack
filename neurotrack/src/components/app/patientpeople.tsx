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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Volume2 } from "lucide-react";

// Backend URL
const API_URL = "http://localhost:5000/people";

interface Person {
  _id: string;
  name: string;
  relation: string;
}

export function PatientPeople() {
  const [people, setPeople] = useState<Person[]>([]);

  // Fetch people added by caregiver
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (Array.isArray(data)) {
          setPeople(data);
        } else {
          setPeople([]);
        }
      } catch (err) {
        console.error("Error fetching people:", err);
        setPeople([]);
      }
    };

    fetchPeople();
  }, []);

  // Voice feedback
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 0.9;
      speechSynthesis.speak(msg);
    }
  };

  const speakAll = () => {
    if (people.length === 0) return;
    const combined = people
      .map((p) => `${p.name}, your ${p.relation}`)
      .join(". ");
    speak("Here are the important people in your life. " + combined);
  };

  return (
    <Card className="w-full shadow-xl border border-gray-300 rounded-2xl bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-purple-700 flex justify-center items-center gap-2">
          <Users />
          Important People
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          View the people your caregiver added for easy memory support
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {/* People List */}
        <ScrollArea className="h-80 w-full pr-4">
          {people.length > 0 ? (
            <div className="space-y-4">
              {people.map((person) => (
                <div
                  key={person._id}
                  className="p-4 bg-purple-100 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-xl font-semibold text-purple-900">
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Relation: {person.relation}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      speak(`${person.name}, your ${person.relation}`)
                    }
                    className="bg-white border p-2 rounded-full shadow-md"
                  >
                    <Volume2 className="w-6 h-6 text-purple-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20 text-xl">
              No people added yet.
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-center">
        <button
          onClick={speakAll}
          disabled={people.length === 0}
          className="w-full text-xl py-6 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 shadow-lg"
        >
          Speak All
        </button>
      </CardFooter>
    </Card>
  );
}
