"use client";
import { Globe } from "@/components/globe";
import { FlipWordsDemo } from "@/components/FlipWords";

export default function Home() {
  return (
    <div className="container mx-auto mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-100px)] p-4">
        <div className="order-2 lg:order-1">
          <FlipWordsDemo />
        </div>
        <div className="order-1 lg:order-2 relative h-[500px] lg:h-full">
          <Globe />
        </div>
      </div>
    </div>
  );
}
