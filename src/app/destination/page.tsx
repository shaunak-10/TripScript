"use client";

import { useState, useEffect } from "react";

interface Overview {
  city: string;
  best_time_to_visit: {
    description: string;
    seasons: {
      season: string;
      description: string;
    }[];
  };
  local_customs_and_culture: {
    greetings: string;
    etiquette: string;
    dress_code: string;
    food_and_drink: string;
    religious_practices: string;
  };
  safety_tips: {
    general: string;
    crime: string;
    traffic: string;
    health: string;
    emergency_numbers: string;
  };
  transportation: {
    options: {
      mode: string;
      description: string;
    }[];
  };
  landmarks_and_attractions: {
    popular_landmarks: {
      name: string;
      description: string;
    }[];
    other_attractions: {
      name: string;
      description: string;
    }[];
  };
  cultural_experiences: {
    unique_activities: {
      activity: string;
      description: string;
    }[];
    events_and_festivals: {
      event: string;
      description: string;
    }[];
  };
  day_trips_and_excursions: {
    destinations: {
      destination: string;
      description: string;
    }[];
  };
}

const XYZPage: React.FC = () => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch("/api/destination-discovery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: "Goa",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch overview");
        }

        const data: Overview = await response.json();
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchOverview();
  }, []);

  //   if (error) {
  //     return (
  //       <div className="container mx-auto px-4 py-8 h-full">
  //         <MessageBox message={error} type="error" />
  //       </div>
  //     );
  //   }

  if (!overview) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover {overview.city}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Best Time to Visit</h2>
          <p>{overview.best_time_to_visit.description}</p>
          <ul className="mt-4">
            {overview.best_time_to_visit.seasons.map((season, index) => (
              <li key={index} className="mb-3">
                <h3 className="font-semibold">{season.season}</h3>
                <p>{season.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Local Customs and Culture
          </h2>
          <p>
            <strong>Greetings:</strong>{" "}
            {overview.local_customs_and_culture.greetings}
          </p>
          <p>
            <strong>Etiquette:</strong>{" "}
            {overview.local_customs_and_culture.etiquette}
          </p>
          <p>
            <strong>Dress Code:</strong>{" "}
            {overview.local_customs_and_culture.dress_code}
          </p>
          <p>
            <strong>Food and Drink:</strong>{" "}
            {overview.local_customs_and_culture.food_and_drink}
          </p>
          <p>
            <strong>Religious Practices:</strong>{" "}
            {overview.local_customs_and_culture.religious_practices}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Safety Tips</h2>
          <p>
            <strong>General:</strong> {overview.safety_tips.general}
          </p>
          <p>
            <strong>Crime:</strong> {overview.safety_tips.crime}
          </p>
          <p>
            <strong>Traffic:</strong> {overview.safety_tips.traffic}
          </p>
          <p>
            <strong>Health:</strong> {overview.safety_tips.health}
          </p>
          <p>
            <strong>Emergency Numbers:</strong>{" "}
            {overview.safety_tips.emergency_numbers}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transportation</h2>
          <ul>
            {overview.transportation.options.map((option, index) => (
              <li key={index} className="mb-3">
                <strong>{option.mode}:</strong> {option.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Landmarks and Attractions
          </h2>
          <h3 className="text-lg font-semibold mt-4">Popular Landmarks</h3>
          <ul>
            {overview.landmarks_and_attractions.popular_landmarks.map(
              (landmark, index) => (
                <li key={index} className="mb-3">
                  <strong>{landmark.name}:</strong> {landmark.description}
                </li>
              )
            )}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Other Attractions</h3>
          <ul>
            {overview.landmarks_and_attractions.other_attractions.map(
              (attraction, index) => (
                <li key={index} className="mb-3">
                  <strong>{attraction.name}:</strong> {attraction.description}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cultural Experiences</h2>
          <h3 className="text-lg font-semibold mt-4">Unique Activities</h3>
          <ul>
            {overview.cultural_experiences.unique_activities.map(
              (activity, index) => (
                <li key={index} className="mb-3">
                  <strong>{activity.activity}:</strong> {activity.description}
                </li>
              )
            )}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Events and Festivals</h3>
          <ul>
            {overview.cultural_experiences.events_and_festivals.map(
              (event, index) => (
                <li key={index} className="mb-3">
                  <strong>{event.event}:</strong> {event.description}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Day Trips and Excursions
          </h2>
          <ul>
            {overview.day_trips_and_excursions.destinations.map(
              (destination, index) => (
                <li key={index} className="mb-3">
                  <strong>{destination.destination}:</strong>{" "}
                  {destination.description}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default XYZPage;
