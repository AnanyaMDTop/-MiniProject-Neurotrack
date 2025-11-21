"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_URL = "http://localhost:5000";

export function Signup({ onSignup }: { onSignup: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Signup successful! You can now login.");
        setError("");
        onSignup();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <div className="mb-4">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="mb-4">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div className="mb-4">
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <div className="mb-4">
        <Label>Role</Label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded w-full">
          <option value="patient">Patient</option>
          <option value="caregiver">Caregiver</option>
          <option value="doctor">Doctor</option>
        </select>
      </div>
      <Button onClick={handleSignup} className="w-full">Sign Up</Button>
    </div>
  );
}
