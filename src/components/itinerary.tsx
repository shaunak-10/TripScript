import React from "react";

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
  console.log(trip);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
        {trip.trip_name}
      </h1>

      {trip.itinerary.map((day, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-2xl shadow-xl mb-12 transition-all hover:shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-2 sm:mb-0">
              {day.theme}
            </h2>
            <span className="text-lg font-semibold text-green-600 bg-green-100 px-6 py-2 rounded-full shadow-inner">
              Day {day.day}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {day.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-105"
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
      ))}
    </div>
  );
};

export default Itinerary;
