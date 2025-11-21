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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users } from "lucide-react";
import { PersonCard, type Person } from "./person-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Backend URL
const API_URL = "http://localhost:5000/people";

export function PeopleFeature() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", relation: "" });

  // Fetch people for logged-in user
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // user not logged in

        const res = await fetch(API_URL, {
          method: "GET",
          headers: {Authorization: `Bearer ${token}`}
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setPeople(data);
        } else {
          console.error("Error fetching people:", data.message || data);
        }
      } catch (err) {
        console.error("Error fetching people:", err);
      }
    };
    fetchPeople();
  }, []);

  // Add new person
  const handleAddPerson = async () => {
  if (!newPerson.name || !newPerson.relation) {
    alert("Please fill in both name and relation");
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(newPerson),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add person");
    }

    const data = await res.json();
    setPeople(prev => [...prev, data]);
    setNewPerson({ name: "", relation: "" });
    setIsFormOpen(false);

  } catch (err) {
    console.error("❌ Error adding person:", err);
     // show error to user
  }
};


  // Delete person
  const handleDeletePerson = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete person");

      setPeople((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Error deleting person:", err);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Users className="mr-2" />
          Family & Friends
        </CardTitle>
        <CardDescription>
          Keep track of important people in your life.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {people.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {people.map((person) => (
              <PersonCard
                key={person._id}
                person={{_id: person._id, name: person.name, relation: person.relation }}
                onDelete={handleDeletePerson}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <p>No people added yet. Add someone to get started!</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full text-lg py-6 sm:py-4"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Person
        </Button>
      </CardFooter>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Person</DialogTitle>
            <DialogDescription>
              Enter the details of the person you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPerson.name}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, name: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                Relation
              </Label>
              <Input
                id="relation"
                value={newPerson.relation}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, relation: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Granddaughter"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddPerson}>Save Person</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
