import { getTrip } from "@/actions/get-itinerary";
import Itinerary from "@/components/itinerary";
import type { Trip } from "@/components/itinerary";

export default async function YourTrip() {
  const trip: Trip = await getTrip(
    "Please create a detailed day-wise itinerary in JSON format for a 5-day trip to India with a budget of Rs. 10000000. Include accommodations, transportation, activities based on nature, hiphop, and EDM options. Provide descriptions, costs, and durations for each component. Convert all costs to INR (Rs) for an overall budget estimate."
  );

  return <Itinerary trip={trip} />;
}
