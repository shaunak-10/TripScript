"use client";

import { useState, useEffect } from "react";
import Itinerary from "@/components/itinerary";
import type { Trip } from "@/components/itinerary";
import Loading from "./loading";
import MessageBox from "@/components/messagebox";
import { Button } from "@nextui-org/react";
import { db, auth } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function YourTrip({
  searchParams,
}: {
  searchParams: {
    destination: string;
    days: string;
    budget: string;
    theme: string;
    people: string;
  };
}) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const { destination, days, budget, theme, people } = searchParams;

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const prompt = `Please create a detailed day-wise itinerary in JSON format for a ${days}-day trip to ${destination} with total budget of Rs. ${budget} for ${people} people  . Include accommodations, transportation, activities based on ${theme} options. Provide descriptions, costs, and durations for each component. Convert all costs to INR (Rs) for an overall budget estimate.`;

        const response = await fetch("/api/get-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          setError("Failed to fetch itinerary");
        }

        const data: Trip = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };
    fetchItinerary();
  }, [destination, days, budget, theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function addItineraryToFirestore(trip: Trip) {
    setIsSaving(true);
    if (!user) {
      setError("You must be logged in to save an itinerary.");
      router.push("/login");
    }
    try {
      const docRef = await addDoc(collection(db, "itineraries"), {
        trip,
        userId: user?.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      router.push("/protected");
    } catch (error) {
      setError("Failed to save itinerary");
      if (error instanceof Error) {
        console.error("Error adding document: ", error.message);
      }
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 h-full">
        <MessageBox message={error} type="error" />
      </div>
    );
  }

  if (!trip) {
    return Loading();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <Itinerary trip={trip} />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
          <Button
            isLoading={isSaving}
            color="primary"
            onClick={() => addItineraryToFirestore(trip)}
            className="px-6 py-2 text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {user ? "Save Itinerary" : "Log in to Save Itinerary"}
          </Button>
        </div>
      </div>
    </div>
  );
}
