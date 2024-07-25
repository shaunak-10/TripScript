import React from "react";
import { FlipWords } from "@/uistuff/flip-words";
import { Button } from "@nextui-org/react";

export function FlipWordsDemo() {
  const words = ["smarter", "easier", "personalized", "unforgettable"];

  return (
    <div className="flex flex-col justify-center h-full space-y-6">
      <div className="text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400">
          AI-Powered
        </span>
        <br />
        <span className="text-gray-800 dark:text-gray-100">
          Travel Planning
        </span>
      </div>
      <div className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
        Making your journeys
        <FlipWords
          words={words}
          className="text-blue-600 dark:text-blue-400 font-bold ml-2"
        />
      </div>
      {/* <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
        Your intelligent companion, from itinerary creation to real-time
        recommendations
      </p> */}
      <Button color="primary" className="mt-4 px-6 py-3 w-fit">
        Plan Your Adventure
      </Button>
    </div>
  );
}
