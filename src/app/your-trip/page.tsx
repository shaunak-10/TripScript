"use client";

import { useState, useEffect } from "react";
import Itinerary from "@/components/itinerary";
import type { Trip } from "@/components/itinerary";
import Loading from "./loading";
export default function YourTrip({
  searchParams,
}: {
  searchParams: {
    destination: string;
    days: string;
    budget: string;
    theme: string;
  };
}) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { destination, days, budget, theme } = searchParams;

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const prompt = `Please create a detailed day-wise itinerary in JSON format for a ${days}-day trip to ${destination} with a budget of Rs. ${budget}. Include accommodations, transportation, activities based on ${theme}, Camping options. Provide descriptions, costs, and durations for each component. Convert all costs to INR (Rs) for an overall budget estimate.`;

        const response = await fetch("/api/get-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch itinerary");
        }

        const data: Trip = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchItinerary();
  }, [destination, days, budget, theme]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trip) {
    return Loading(); 
  }

  return <Itinerary trip={trip} />;
}
