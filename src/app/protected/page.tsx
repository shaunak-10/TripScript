"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase"; // Import from firebase.ts
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
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

  const getItineraries = async () => {
    const itinerariesRef = collection(db, "itineraries");
    const itineraries = await getDocs(
      query(itinerariesRef, where("userId", "==", user?.uid))
    );
    if (itineraries.empty) {
      console.log("No itineraries found");
    } else {
      itineraries.forEach((doc) => {
        console.log(doc.data().trip);
      });
    }
  };

  return (
    <div className="bg-white p-8">
      {user ? (
        user.emailVerified ? (
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-48 h-48 rounded-full mb-4"
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt="User Profile"
            />
            <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
            <p className="text-lg mb-4">{user.email}</p>
            <p className="text-lg mb-4">UID: {user.uid}</p>
            <p className="text-lg mb-4">
              Logged in using: {user.providerData[0].providerId}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign Out
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-5"
              onClick={getItineraries}
            >
              your itineraries
            </button>
          </div>
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

export default ProfilePage;
