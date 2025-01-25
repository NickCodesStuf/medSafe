"use client";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState(""); // New parameter
  const [response, setResponse] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password, permission }),
      });
      console.log(JSON.stringify({ name, password, permission }));

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const result = await res.json();
      setResponse(result.message || "Registration successful");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <input
          type="text"
          placeholder="Permission (e.g., admin, user)"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
        {response && (
          <p className="mt-4 text-center text-sm text-gray-600">{response}</p>
        )}
      </div>
    </div>
  );
}
