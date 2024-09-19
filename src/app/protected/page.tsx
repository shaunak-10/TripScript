"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase"; // Import from firebase.ts
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";

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
          <Card className="max-w-fit">
            <CardHeader className="justify-center">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  className=" w-30 h-30"
                  src={
                    user
                      ? user.photoURL
                        ? user.photoURL
                        : "https://via.placeholder.com/150"
                      : "https://via.placeholder.com/150"
                  }
                />
                <div className="flex flex-col gap-1 items-center justify-center">
                  <h4 className="text-large font-semibold leading-none text-default-800">
                    {user?.displayName}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    {user?.email}
                  </h5>
                </div>
                {/*
              icon div
            */}
                <div className="flex flex-col gap-1 items-center justify-center">
                  {user.providerData[0].providerId === "google.com" && (
                    <img
                      src="https://img.icons8.com/color/48/000000/google-logo.png"
                      alt="Google Logo"
                      className="w-6 h-6 mr-2"
                    />
                  )}{" "}
                </div>
              </div>
            </CardHeader>
            <CardFooter className="justify-center space-x-4">
              <Button className="bg-red-500" onClick={handleSignOut}>
                Logout
              </Button>
              <Button className="bg-slate-500" onClick={getItineraries}>
                Your itineraries
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <p className="text-lg font-medium">Email not verified</p>
        )
      ) : (
        <p> Please login to see your profile</p>
      )}
    </div>
    // Ui content
  );
}

export default ProfilePage;
