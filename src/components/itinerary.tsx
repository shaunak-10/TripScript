"use client";
import React, { useState } from "react";

interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
  notes: string;
}

interface Day {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Trip {
  trip_name: string;
  budget: number;
  currency: string;
  itinerary: Day[];
}

const Itinerary = ({ trip }: { trip: Trip }) => {
  const [currentDay, setCurrentDay] = useState(0);

  const nextDay = () => {
    setCurrentDay((prev) => (prev + 1) % trip.itinerary.length);
  };

  const prevDay = () => {
    setCurrentDay(
      (prev) => (prev - 1 + trip.itinerary.length) % trip.itinerary.length
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
        {trip.trip_name}
      </h1>

      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={prevDay}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-gradient-to-br from-blue-50 to-green-50 text-black p-4 rounded-full shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextDay}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-gradient-to-br from-blue-50 to-green-50 text-black p-4 rounded-full shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl ">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentDay * 100}%)` }}
          >
            {trip.itinerary.map((day, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="bg-white p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-700 mb-2 sm:mb-0">
                      {day.theme}
                    </h2>
                    <span className="text-lg font-semibold text-green-600 bg-green-100 px-6 py-2 rounded-full shadow-inner">
                      Day {day.day}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {day.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-105"
                      >
                        <div className="p-6 flex-grow">
                          <h3 className="text-2xl font-bold mb-4 text-blue-800">
                            {activity.name}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                        <div className="bg-white px-6 py-4 mt-auto border-t border-blue-100">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <p className="text-blue-600">
                              <span className="mr-2 text-lg">⏰</span>
                              {activity.duration}
                            </p>
                            <p className="text-green-600">
                              <span className="mr-2 text-lg">💰</span>
                              {activity.cost}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {trip.itinerary.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDay(index)}
            className={`mx-2 w-4 h-4 rounded-full transition-all ${
              currentDay === index
                ? "bg-blue-500 scale-125"
                : "bg-gray-300 hover:bg-blue-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Itinerary;
