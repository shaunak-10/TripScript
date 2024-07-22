"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase"; // Import from firebase.ts
import { onAuthStateChanged, signOut, User } from "firebase/auth";

function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Update user state after successful signout
    } catch (error) {
      console.error("Sign out error:", error);
      // Handle sign out errors (e.g., display error message)
    }
  };
  return (
    <div className="flex flex-col items-center pt-12 pb-16 px-4">
      {user ? (
        user.emailVerified ? (
          <>
            <h1 className="text-3xl font-bold mb-8">Protected Page</h1>
            <div className="flex flex-col space-y-4 items-center">
              <p className="text-lg font-medium">Hello, {user.displayName}!</p>
              <p className="text-base">Email: {user.email}</p>
              <p className="text-base">UID: {user.uid}</p>
              <p className="text-base">
                Logged in using: {user.providerData[0].providerId}
              </p>
              <img
                className="w-24 h-24 rounded-full mb-4"
                src={user.photoURL ?? "https://via.placeholder.com/150"}
                alt="User Profile"
              />
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg font-medium">Email not verified</p>
        )
      ) : (
        <p className="text-lg font-medium">
          You are not logged in. Please log in first.
        </p>
      )}
    </div>
  );
}

export default ProtectedPage;
