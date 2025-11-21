"use client";
import { useState } from "react";

const API_URL = "http://localhost:5000/auth";

export function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const url = `${API_URL}/${isSignup ? "signup" : "login"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, password, role } : { email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Something went wrong");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      window.location.href = "/home";
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
        {isSignup && (
          <>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="caregiver">Caregiver</option>
              <option value="doctor">Doctor</option>
            </select>
          </>
        )}
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="text-center text-sm text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
