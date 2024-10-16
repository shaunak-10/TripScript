"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import DestinationLoading from "./loading";
import MessageBox from "@/components/messagebox";
import Loading from "../destination/loading";
import WishlistHeart from "@/components/wishlistHeart";
import dynamic from "next/dynamic";
import { Config, Data, Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"));

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

interface FutureWeather {
  temperature: number[][];
  sunshine: number[];
  daylight: number[];
}

interface UnsplashImage {
  id: string;
  alt_description: string | null;
  urls: {
    regular: string;
  };
}

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
interface RainfallData {
  rainfall: number[];
}

const DestinationPage: React.FC = () => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [rainfallData, setRainfallData] = useState<RainfallData | null>(null);
  const [futureWeather, setFutureWeather] = useState<FutureWeather | null>(
    null
  );
  const searchParams = useSearchParams();
  const city = useMemo(() => searchParams.get("city") || "", [searchParams]);

  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const openWeatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const generateQuery = useCallback((city: string) => {
    const touristKeywords = [
      "landmarks",
      "attractions",
      "sightseeing",
      "tourism",
      "travel destination",
    ];
    const randomKeyword =
      touristKeywords[Math.floor(Math.random() * touristKeywords.length)];
    return `${city} ${randomKeyword}`;
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const query = generateQuery(city);
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query
          )}&per_page=8&content_filter=high&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${accessKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data.results);
      } catch (error) {
        setError("Error fetching images");
      }
    };

    const fetchOverview = async () => {
      try {
        const response = await fetch("/api/destination-discovery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch overview");
        }

        const data = await response.json();
        setOverview(data.overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } catch (err) {
        setError("Error fetching weather data");
      }
    };

    const fetchFutureWeather = async () => {
      try {
        const currentDate = new Date();
        const startDate = Math.floor(
          (currentDate.getTime() - new Date("2024-07-01").getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const endDate = startDate + 10;

        const response = await fetch("http://127.0.0.1:8000/api/temperature/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: "bharuch",
            start_date: startDate,
            end_date: endDate,
          }),
        });

        if (!response.ok)
          throw new Error("Failed to fetch future weather data");
        const data = await response.json();
        setFutureWeather(data);
      } catch (err) {
        setError("Error fetching future weather data");
      }
    };

    const fetchRainfallData = async () => {
      const currentDate = new Date();
      const startDate = Math.floor(
        (currentDate.getTime() - new Date("2024-07-01").getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const endDate = startDate + 10;
      try {
        const response = await fetch("http://localhost:8000/api/rain/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: "bharuch",
            start_date: startDate,
            end_date: endDate,
          }),
        });
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch rainfall data");
        const data = await response.json();
        console.log(data);
        setRainfallData(data);
      } catch (err) {
        setError("Error fetching rainfall data");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchImages(),
        fetchOverview(),
        fetchFutureWeather(),
        fetchRainfallData(),
        fetchWeather(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [city, accessKey, generateQuery, openWeatherApiKey]);

  if (loading) {
    return <DestinationLoading />;
  }

  if (error) {
    return <MessageBox type="error" message={error} />;
  }

  if (
    !overview ||
    images.length === 0 ||
    !weather ||
    !futureWeather ||
    !rainfallData
  ) {
    return <Loading />;
  }

  const renderWeatherSection = () => {
    const dates = Array.from({ length: 11 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    const temperatureData: Data = {
      x: dates,
      y: futureWeather.temperature.map((t) => t[1]),
      type: "scatter",
      mode: "lines+markers",
      name: "Max Temperature",
      line: { color: "rgb(255, 99, 132)" },
    };

    const minTemperatureData: Data = {
      x: dates,
      y: futureWeather.temperature.map((t) => t[0]),
      type: "scatter",
      mode: "lines+markers",
      name: "Min Temperature",
      line: { color: "rgb(75, 192, 192)" },
    };

    const layout: Partial<Layout> = {
      title: "Temperature Forecast",
      xaxis: { title: "Date" },
      yaxis: { title: "Temperature (°C)" },
      autosize: true,
      height: 300,
      margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
    };

    const config: Partial<Config> = { responsive: true };

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Weather Forecast
        </h2>
        <div className="flex items-center mb-4">
          <Image
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={50}
            height={50}
          />
          <div className="ml-4">
            <p className="text-3xl font-bold">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-gray-600 capitalize">{weather.description}</p>
          </div>
        </div>
        <div className="mt-8">
          <Plot
            data={[temperatureData, minTemperatureData]}
            layout={layout}
            config={config}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    );
  };

  const renderRainfallSection = () => {
    const dates = Array.from({ length: 11 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    const rainfallChartData: Data = {
      x: dates,
      y: rainfallData.rainfall,
      type: "bar",
      name: "Rainfall",
      text: rainfallData.rainfall.map((r) => `${r.toFixed(2)} mm`),
      marker: { color: "rgb(0, 123, 255)" },
    };

    const layout: Partial<Layout> = {
      title: "Rainfall Forecast",
      xaxis: { title: "Date" },
      yaxis: { title: "Rainfall (mm)" },
      autosize: true,
      height: 400,
      margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
    };

    const config: Partial<Config> = { responsive: true };

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Rainfall Forecast
        </h2>
        <Plot
          data={[rainfallChartData]}
          layout={layout}
          config={config}
          style={{ width: "100%" }}
        />
      </div>
    );
  };
  return (
    <>
      <div className="p-8 bg-gray-100">
        <div className="p-8 bg-gray-100 flex  items-center justify-between">
          <h1 className="text-5xl font-extrabold text-center text-blue-800 tracking-tight">
            Discover {overview.city}
          </h1>
          <div className="flex justify-center items-center">
            <WishlistHeart city={overview.city} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg ${
                index === 0
                  ? "col-span-8 row-span-2"
                  : index === 1
                  ? "col-span-4 row-span-1"
                  : index === 2
                  ? "col-span-4 row-span-1"
                  : index === 3
                  ? "col-span-4 row-span-2"
                  : "col-span-4 row-span-1"
              }`}
              style={{
                height: index === 0 || index === 3 ? "600px" : "290px",
              }}
            >
              <Image
                src={image.urls.regular}
                alt={image.alt_description || "Tourist Place Image"}
                layout="fill"
                objectFit="cover"
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {renderWeatherSection()}
        {renderRainfallSection()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Best Time to Visit */}
          <div className="bg-blue-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Best Time to Visit
            </h2>
            <p className="text-gray-700 mb-4">
              {overview.best_time_to_visit.description}
            </p>
            <ul className="list-disc list-inside">
              {overview.best_time_to_visit.seasons?.map((season, index) => (
                <li key={index} className="mb-3">
                  <span className="font-semibold text-blue-500">
                    {season.season}:
                  </span>
                  <span className="text-gray-600"> {season.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Local Customs and Culture */}
          <div className="bg-green-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Local Customs and Culture
            </h2>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <span className="font-semibold text-green-500">Greetings:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.local_customs_and_culture.greetings}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-green-500">Etiquette:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.local_customs_and_culture.etiquette}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-green-500">
                  Dress Code:
                </span>
                <span className="text-gray-600">
                  {" "}
                  {overview.local_customs_and_culture.dress_code}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-green-500">
                  Food and Drink:
                </span>
                <span className="text-gray-600">
                  {" "}
                  {overview.local_customs_and_culture.food_and_drink}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-green-500">
                  Religious Practices:
                </span>
                <span className="text-gray-600">
                  {" "}
                  {overview.local_customs_and_culture.religious_practices}
                </span>
              </li>
            </ul>
          </div>

          {/* Safety Tips */}
          <div className="bg-red-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Safety Tips
            </h2>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <span className="font-semibold text-red-500">General:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.safety_tips.general}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-red-500">Crime:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.safety_tips.crime}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-red-500">Traffic:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.safety_tips.traffic}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-red-500">Health:</span>
                <span className="text-gray-600">
                  {" "}
                  {overview.safety_tips.health}
                </span>
              </li>
              <li className="mb-2">
                <span className="font-semibold text-red-500">
                  Emergency Numbers:
                </span>
                <span className="text-gray-600">
                  {" "}
                  {overview.safety_tips.emergency_numbers}
                </span>
              </li>
            </ul>
          </div>

          {/* Transportation */}
          <div className="bg-purple-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              Transportation
            </h2>
            <ul className="list-disc list-inside">
              {overview.transportation.options?.map((option, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold text-purple-500">
                    {option.mode}:
                  </span>
                  <span className="text-gray-600"> {option.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Landmarks and Attractions */}
          <div className="bg-indigo-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              Landmarks and Attractions
            </h2>
            <h3 className="text-xl font-semibold mt-4 text-indigo-500">
              Popular Landmarks
            </h3>
            <ul className="list-disc list-inside">
              {overview.landmarks_and_attractions.popular_landmarks?.map(
                (landmark, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold text-indigo-400">
                      {landmark.name}:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      {landmark.description}
                    </span>
                  </li>
                )
              )}
            </ul>
            <h3 className="text-xl font-semibold mt-4 text-indigo-500">
              Other Attractions
            </h3>
            <ul className="list-disc list-inside">
              {overview.landmarks_and_attractions.other_attractions?.map(
                (attraction, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold text-indigo-400">
                      {attraction.name}:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      {attraction.description}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Cultural Experiences */}
          <div className="bg-teal-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-600">
              Cultural Experiences
            </h2>
            <h3 className="text-xl font-semibold mt-4 text-teal-500">
              Unique Activities
            </h3>
            <ul className="list-disc list-inside">
              {overview.cultural_experiences.unique_activities?.map(
                (activity, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold text-teal-400">
                      {activity.activity}:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      {activity.description}
                    </span>
                  </li>
                )
              )}
            </ul>
            <h3 className="text-xl font-semibold mt-4 text-teal-500">
              Events and Festivals
            </h3>
            <ul className="list-disc list-inside">
              {overview.cultural_experiences.events_and_festivals?.map(
                (event, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold text-teal-400">
                      {event.event}:
                    </span>
                    <span className="text-gray-600"> {event.description}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Day Trips and Excursions */}
          <div className="bg-gray-50 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Day Trips and Excursions
            </h2>
            <ul className="list-disc list-inside">
              {overview.day_trips_and_excursions.destinations?.map(
                (destination, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold text-gray-600">
                      {destination.destination}:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      {destination.description}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-100">
        <div className="grid grid-cols-12 gap-4">
          {images.slice(0, 9).map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg ${
                index === 0
                  ? "col-span-8 row-span-2 hidden"
                  : index === 1
                  ? "col-span-4 row-span-1 hidden"
                  : index === 2
                  ? "col-span-4 row-span-1 hidden"
                  : index === 3
                  ? "col-span-4 row-span-2"
                  : "col-span-4 row-span-1"
              }`}
              style={{
                height: index === 0 || index === 3 ? "600px" : "290px",
              }}
            >
              <Image
                src={image.urls.regular}
                alt={image.alt_description || "Tourist Place Image"}
                layout="fill"
                objectFit="cover"
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DestinationPage;
