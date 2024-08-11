"use client";

import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const themes = [
  {
    key: 1,
    label: "Nature Walks",
  },
  {
    key: 2,
    label: "Adventure Camp",
  },
  {
    key: 3,
    label: "Wildlife Safari",
  },
  {
    key: 4,
    label: "Beach Day",
  },
  {
    key: 5,
    label: "Cultural Tour",
  },
  {
    key: 6,
    label: "City Exploration",
  },
  {
    key: 7,
    label: "Hiking Trip",
  },
  {
    key: 8,
    label: "Water Sports",
  },
  {
    key: 9,
    label: "Yoga Retreat",
  },
  {
    key: 10,
    label: "Historical Tour",
  },
  {
    key: 11,
    label: "Camping Experience",
  },
  {
    key: 12,
    label: "Mountain Biking",
  },
  {
    key: 13,
    label: "Culinary Adventure",
  },
  {
    key: 14,
    label: "Photography Expedition",
  },
  {
    key: 15,
    label: "Relaxation and Spa Day",
  },
];
function getLabelsFromKeys(selectedKeys: number[]) {
  const themesMap = new Map(themes.map((theme) => [theme.key, theme.label]));

  return selectedKeys
    .map((key) => themesMap.get(key))
    .filter((label) => label !== undefined);
}

export default function TripPreferences() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [theme, setTheme] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setButtonLoading(true);
    console.log("Form submitted:", { destination, days, budget, theme });
    //Now navigate to /your-trip with all data
    router.push(
      `/your-trip?destination=${destination}&days=${days}&budget=${budget}&theme=${theme}`
    );
    setButtonLoading(false);
  }
  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Enter your preferences </h1>
      <form
        className="flex flex-col space-y-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {" "}
        {/* Matched form container */}
        <Input
          type="text"
          id="destination"
          label="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Input
          type="number"
          id="days"
          label="How long?"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <Input
          type="number"
          id="budget"
          label="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <Select
          selectionMode="multiple"
          id="theme"
          aria-label="What would you like to base your trip on?"
          label="What would you like to base your trip on?"
          value={theme}
          onChange={(e) => {
            let sel = getLabelsFromKeys(
              e.target.value.split(",").map((key) => parseInt(key))
            ).join(", ");
            setTheme(sel);
          }}
        >
          {themes.map((theme) => (
            <SelectItem key={theme.key}>{theme.label}</SelectItem>
          ))}
        </Select>
        <Button
          type="submit"
          className="w-full inline-flex items-center px-4 py-2"
          color="primary"
          isLoading={buttonLoading}
        >
          Get Itinerary
        </Button>
      </form>
    </div>
  );
}
