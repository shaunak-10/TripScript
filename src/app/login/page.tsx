"use client";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "@/firebase"; // Import from firebase.ts
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import MessageBox from "@/components/messagebox";
import { Input, Button, Link } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsFormLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.push("/protected");
    } catch (error: any) {
      const errorMessage = error.code.split("/").pop().replace(/-/g, " ");
      setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
    }
    setIsFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Handle successful Google login (e.g., redirect to protected page)
      console.log("User logged in with Google:", result.user);
      router.push("/protected"); // Replace with your protected route
    } catch (error: any) {
      const errorMessage = error.code.split("/").pop().replace(/-/g, " ");
      setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "If you have signed up with us, you would have received an email to reset your password."
      );
    } catch (error: any) {
      const errorMessage = error.code.split("/").pop().replace(/-/g, " ");
      setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
    }
    setIsResetLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4 w-full">
      <h1 className="text-4xl font-bold mb-8">Login to TripScript</h1>
      <div className="flex flex-col space-y-6 w-full max-w-md">
        {" "}
        {/* Added container for form */}
        <form className="space-y-8" onSubmit={handleEmailLogin}>
          <div className="flex flex-col">
            <Input
              type="email"
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Input
              type={isVisible ? "text" : "password"}
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full inline-flex items-center px-4 py-2"
            color="primary"
            isLoading={isFormLoading}
          >
            Login
          </Button>
        </form>
        <p className="text-sm font-medium mt-4">
          Don't have an account?{" "}
          <Link color="primary" href="/signup">
            Sign up
          </Link>
        </p>
        <p className="text-sm font-medium mt-4">
          Forgot your password?{" "}
          <Button
            color="primary"
            variant="flat"
            onClick={handlePasswordReset}
            isLoading={isResetLoading}
          >
            Reset it
          </Button>
        </p>
        {error && <MessageBox message={error} type="error" />}
        {successMessage && (
          <MessageBox message={successMessage} type="success" />
        )}
      </div>

      <hr className="w-full max-w-md mt-8 border border-t-1" />
      <p className="text-sm font-medium mt-4">or</p>
      <Button
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
      </Button>
    </div>
  );
}

export default LoginPage;
