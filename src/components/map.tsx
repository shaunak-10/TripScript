"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import MessageBox from "./messagebox";

export function Map({ city }: { city: string }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const { Map } = await loader.importLibrary("maps");
        const { Marker } = await loader.importLibrary("marker");

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: city }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const position = results[0].geometry.location;

            const mapOptions: google.maps.MapOptions = {
              center: position,
              zoom: 11,
              mapId: "my_map",
            };

            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

            new Marker({
              map: map,
              position: position,
            });
          } else {
            setError(`Geocoding failed: ${status}`);
          }
        });
      } catch (err) {
        setError(`Error loading map: ${err}`);
      }
    };

    initMap();
  }, [city]);

  if (error) {
    return <MessageBox message={error} type="error" />;
  }

  return (
    <div
      className="h-[400px] mb-8 border border-gray-300 rounded"
      ref={mapRef}
    />
  );
}
