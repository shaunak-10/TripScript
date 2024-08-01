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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 mt-4">
        {trip.trip_name}
      </h1>

      {trip.itinerary.map((day, index) => (
        <div key={index} className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{day.theme}</h2>
            <span className="text-gray-500">Day {day.day}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {day.activities.map((activity, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                <p className="text-gray-700">{activity.description}</p>
                <div className="flex justify-between mt-4">
                  <p className="text-gray-500">Duration: {activity.duration}</p>
                  <p className="text-gray-500">Cost: {activity.cost}</p>
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
