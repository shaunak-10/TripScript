import { NextRequest, NextResponse } from "next/server";
import { destinationDiscovery } from "@/actions/destination-discovery";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";

async function checkPlace(city: string) {
  const placesRef = collection(db, "places");
  const place = await getDocs(
    query(placesRef, where("overview.city", "==", city))
  );
  if (place.empty) {
    console.log("No place found");
    return false;
  } else if (!place.empty) {
    console.log("Place found");
    return place.docs[0].data();
  }
}

export async function POST(request: NextRequest) {
  try {
    let { city } = await request.json();
    if (!city) {
      return NextResponse.json(
        { error: "City name is required" },
        { status: 400 }
      );
    }
    city = city
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const place = await checkPlace(city);
    if (!place) {
      const prompt = `Make me a same output as before for ${city} information should be very concisely and in JSON format.`;
      const overview = await destinationDiscovery(prompt);
      const docRef = await addDoc(collection(db, "places"), {
        overview,
      });
      console.log("Document written with ID: ", docRef.id);
      return NextResponse.json({ overview: overview });
    } else {
      return NextResponse.json(place);
    }

    // const prompt = `I am developing a trip planner and need detailed information about a trip to ${city}. Please provide a comprehensive overview including:

    //                 The best time to visit ${city}.
    //                 Important local customs and cultural practices.
    //                 Safety tips for travelers visiting ${city}.
    //                 The primary transportation options available in ${city}.
    //                 Top popular landmarks and attractions in ${city}.
    //                 Unique cultural experiences and activities that tourists should not miss.
    //                 Any recommended day trips or excursions from ${city}.
    //         Please return the information in a well-structured JSON format.`;
    // const prompt = `Make me a same output as before for ${city} information should be very concisely and in JSON format.`;
    // const overview = await destinationDiscovery(prompt);

    // return NextResponse.json(overview);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate trip overview" },
      { status: 500 }
    );
  }
}
