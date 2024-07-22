"use client";
import { useState } from "react";
import { auth } from "@/firebase"; // Import from firebase.ts
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const updatedUser = {
        ...userCredential.user,
        photoURL:
          "https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg",
        displayName: "Shaunak Mehta",
      };

      await updateProfile(userCredential.user, updatedUser);
      // Handle successful signup (e.g., redirect to login or dashboard)
      console.log(
        "User created successfully, please verify your email",
        userCredential.user
      );
      await sendEmailVerification(userCredential.user);
      router.push("/login"); // Replace with your login or dashboard route
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup errors (e.g., display error message)
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form
        className="flex flex-col space-y-4 w-full max-w-md"
        onSubmit={handleSignup}
      >
        {" "}
        {/* Matched form container */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
