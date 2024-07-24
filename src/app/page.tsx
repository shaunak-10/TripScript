"use client";
import { Globe } from "@/components/globe";
import { FlipWordsDemo } from "@/components/FlipWords";
import InfoCard from "@/components/card";
import compass from "../../public/images/compass.jpeg";
import plane from "../../public/images/plane.jpeg";
import diary from "../../public/images/diary.jpeg";

export default function Home() {
  return (
    <div className="container mx-auto mt-4">
      <div className="grid grid-cols-2 gap-4 items-center min-h-[calc(100vh-100px)] p-4">
        <div className="order-2 lg:order-1">
          <FlipWordsDemo />
        </div>
        <div className="order-1 lg:order-2 relative h-[500px] lg:h-full">
          <Globe />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 my-24">
        <InfoCard
          heading="Your Perfect Trip, Planned"
          subheading="AI-Powered Itinerary Creation"
          image={compass}
          content="Let our AI craft a personalized travel itinerary based on your preferences, interests, and budget. Discover hidden gems and optimize your journey with suggested activities, landmarks, and dining options."
        />
        <InfoCard
          heading="Fly Smart, Save More"
          subheading="Predict and Save on Flights"
          image={plane}
          content="Don't overpay for flights! Our AI predicts price fluctuations, helping you book at the perfect time. Receive alerts for price drops and find the best deals on your dream destinations."
        />
        <InfoCard
          heading="Capture Your Journey"
          subheading="Your Digital Travel Journal"
          image={diary}
          content="Create a lasting memory of your adventures. Document your trips, share experiences, and inspire others with your travel stories and photos."
        />
      </div>
    </div>
  );
}
