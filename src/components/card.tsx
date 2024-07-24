import React from "react";
import { Card, CardHeader, CardBody, Divider, Image } from "@nextui-org/react";
import { StaticImageData } from "next/image";

interface InfoCardProps {
  heading: string;
  subheading: string;
  image: StaticImageData;
  content: string;
}

export default function InfoCard(props: InfoCardProps) {
  return (
    <Card className="max-w-[400px] hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex gap-4 items-center">
        <Image
          alt="Card image"
          className="object-cover rounded-lg"
          height={80}
          src={props.image.src}
          width={80}
        />
        <div className="flex flex-col flex-grow">
          <h4 className="text-xl font-semibold text-foreground">
            {props.heading}
          </h4>
          <p className="text-sm text-default-500">{props.subheading}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="py-4">
        <p className="text-base text-foreground/80">{props.content}</p>
      </CardBody>
    </Card>
  );
}
