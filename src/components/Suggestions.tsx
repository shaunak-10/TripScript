import React from "react";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { StaticImageData } from "next/image";

interface SuggestionCardProps {
  city: string;
  image: StaticImageData;
}

export default function Suggestions(props: SuggestionCardProps) {
  return (
    <Card
      isBlurred
      radius="lg"
      className="border-none size-200 group relative overflow-hidden"
    >
      <Image
        alt={`Image of ${props.city}`}
        className="object-cover rounded-lg transition-all duration-300 group-hover:opacity-50"
        src={props.image.src}
        height={300}
        width={300}
      />
      <CardFooter
        className="
          text-white 
          text-center 
          absolute 
          inset-x-0
          bottom-0
          h-1/3
          flex 
          flex-col
          items-center 
          justify-end
          pb-4
          bg-gradient-to-t 
          from-black/80 
          to-transparent
          rounded-b-lg
          transition-all
          duration-600
          group-hover:h-full
          group-hover:justify-center
          group-hover:bg-black/50
          z-10
        "
      >
        <span
          className="
          transition-all
          duration-500
          transform
          group-hover:scale-110
          mb-2
        "
        >
          {props.city}
        </span>
        <span
          className="
          opacity-0
          transition-all
          duration-500
          transform
          translate-y-4
          group-hover:opacity-100
          group-hover:translate-y-0
          text-sm
        "
        >
          Let's go {"->"}
        </span>
      </CardFooter>
    </Card>
  );
}
