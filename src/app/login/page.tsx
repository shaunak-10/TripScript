"use client";
import { useState } from "react";
import { auth, googleProvider } from "@/firebase"; // Import from firebase.ts
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import ErrorBox from "@/components/errorbox";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in successfully:", userCredential.user);

      console.log("User logged in successfully:", userCredential.user);
      router.push("/protected");
    } catch (error) {
      setError("" + error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Handle successful Google login (e.g., redirect to protected page)
      console.log("User logged in with Google:", result.user);
      router.push("/protected"); // Replace with your protected route
    } catch (error) {
      setError("" + error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent");
    } catch (error) {
      setError("" + error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4 w-full">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {" "}
        {/* Added container for form */}
        <form className="space-y-4" onSubmit={handleEmailLogin}>
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
          {error && <ErrorBox error={error} />}
          <button
            type="submit"
            className="w-full inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-sm font-medium mt-4">
          Don't have an account?{" "}
          <a className="text-blue-500" href="/signup">
            Sign up
          </a>
        </p>
        <p className="text-sm font-medium mt-4">
          Forgot your password?{" "}
          <button className="text-blue-500" onClick={handlePasswordReset}>
            Reset it
          </button>
        </p>
      </div>

      <hr className="w-full max-w-md mt-8 border border-t-1" />
      <p className="text-sm font-medium mt-4">or</p>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-4 w-full max-w-md self-center inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <img
          src="https://img.icons8.com/color/48/000000/google-logo.png"
          alt="Google Logo"
          className="w-6 h-6 mr-2"
        />
        Login with Google
      </button>
    </div>
  );
}

export default LoginPage;
