import { NextRequest, NextResponse } from "next/server";
import { destinationDiscovery } from "@/actions/destination-discovery";

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();
    console.log("City is:", city);
    if (!city) {
      return NextResponse.json(
        { error: "City name is required" },
        { status: 400 }
      );
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
    const prompt = `Make me a same output as before for ${city} information should be very concisely and in JSON format.`;
    const overview = await destinationDiscovery(prompt);

    return NextResponse.json(overview);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate trip overview" },
      { status: 500 }
    );
  }
}
