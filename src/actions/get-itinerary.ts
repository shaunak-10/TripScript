import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (typeof geminiApiKey !== "string") {
  throw new Error("GEMINI_API_KEY is not defined or is not a string");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function parseResponse(responseText: string) {
  // Find the start and end of the JSON object
  const jsonStart = responseText.indexOf("{");
  const jsonEnd = responseText.lastIndexOf("}") + 1;

  // Extract the JSON string
  const jsonString = responseText.substring(jsonStart, jsonEnd);

  console.log(jsonString);

  // Parse the JSON string into an object
  let tripItineraryJson;
  try {
    tripItineraryJson = JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }

  // Parse the additional info

  return tripItineraryJson;
}

export async function getTrip(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Please create a detailed day-wise itinerary in JSON format for a 5-day trip to Paris with a budget of Rs. 100000. Include accommodations, transportation, activities based on art, food, and history, and dining options. Provide descriptions, costs, and durations for each component. Convert all costs to INR (Rs) for an overall budget estimate.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "trip_name": "5-Day Art & History Parisian Adventure",\n  "budget": 100000,\n  "currency": "INR",\n  "itinerary": [\n    {\n      "day": 1,\n      "theme": "Arrival & Parisian Introduction",\n      "activities": [\n        {\n          "name": "Flight to Paris (CDG)",\n          "description": "Arrival at Charles de Gaulle Airport (CDG).",\n          "duration": "As per flight schedule",\n          "cost": "Variable, depends on flight booking",\n          "notes": "Book flight in advance for better deals."\n        },\n        {\n          "name": "Transfer to Hotel",\n          "description": "Taxi or Airport Train (RER B) to Hotel du Nord (3-star)",\n          "duration": "1 hour",\n          "cost": "Taxi: Rs. 1500, RER B: Rs. 250",\n          "notes": "Hotel du Nord offers a comfortable stay near Gare du Nord."\n        },\n        {\n          "name": "Lunch at Le Marais",\n          "description": "Enjoy traditional French cuisine at a local bistro in Le Marais.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 1000",\n          "notes": "Experience the vibrant atmosphere of Le Marais."\n        },\n        {\n          "name": "Explore Le Marais",\n          "description": "Walking tour of the historic Jewish Quarter, Place des Vosges, and Musée Carnavalet.",\n          "duration": "3 hours",\n          "cost": "Free",\n          "notes": "Discover the rich history and charm of Le Marais."\n        },\n        {\n          "name": "Dinner at L\'As du Fallafel",\n          "description": "Sample the famous falafel at this popular street food stall.",\n          "duration": "1 hour",\n          "cost": "Rs. 500",\n          "notes": "A quick and delicious dinner option."\n        }\n      ]\n    },\n    {\n      "day": 2,\n      "theme": "Art & Culture",\n      "activities": [\n        {\n          "name": "Louvre Museum",\n          "description": "Explore the iconic masterpieces, including Mona Lisa and Venus de Milo.",\n          "duration": "4 hours",\n          "cost": "Rs. 1000 (entry fee)",\n          "notes": "Book tickets online to skip the queues."\n        },\n        {\n          "name": "Lunch at Café Marly",\n          "description": "Enjoy a classic French lunch with a view of the Louvre Pyramid.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 2000",\n          "notes": "A luxurious dining experience."\n        },\n        {\n          "name": "Musée d\'Orsay",\n          "description": "Admire Impressionist and Post-Impressionist art, including works by Monet, Renoir, and Van Gogh.",\n          "duration": "3 hours",\n          "cost": "Rs. 800 (entry fee)",\n          "notes": "A must-visit for art enthusiasts."\n        },\n        {\n          "name": "Dinner at Le Bouillon Chartier",\n          "description": "Experience a traditional Parisian bistro with affordable and delicious French cuisine.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 1500",\n          "notes": "A popular choice for both locals and tourists."\n        }\n      ]\n    },\n    {\n      "day": 3,\n      "theme": "Historical Landmarks & Parisian Charm",\n      "activities": [\n        {\n          "name": "Eiffel Tower",\n          "description": "Ascend to the top for panoramic views of Paris.",\n          "duration": "3 hours",\n          "cost": "Rs. 1500 (entry fee)",\n          "notes": "Book tickets online to avoid long queues."\n        },\n        {\n          "name": "Lunch at La Tour Eiffel",\n          "description": "Enjoy a gourmet lunch with stunning views of the city.",\n          "duration": "2 hours",\n          "cost": "Rs. 3000",\n          "notes": "A memorable dining experience with a Parisian touch."\n        },\n        {\n          "name": "Seine River Cruise",\n          "description": "Relaxing cruise along the Seine, passing by iconic landmarks.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 1000",\n          "notes": "A romantic way to see the city from a different perspective."\n        },\n        {\n          "name": "Dinner at Chez Jenny",\n          "description": "Taste traditional French cuisine in a cozy and charming bistro.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 1200",\n          "notes": "A local favorite for authentic French flavors."\n        }\n      ]\n    },\n    {\n      "day": 4,\n      "theme": "Shopping & Montmartre",\n      "activities": [\n        {\n          "name": "Shopping on Champs-Élysées",\n          "description": "Explore the iconic avenue with its luxury boutiques and department stores.",\n          "duration": "3 hours",\n          "cost": "Depends on purchases",\n          "notes": "Enjoy the atmosphere and window shop or indulge in some luxury purchases."\n        },\n        {\n          "name": "Lunch at Ladurée",\n          "description": "Indulge in delicious macarons and pastries at this renowned patisserie.",\n          "duration": "1 hour",\n          "cost": "Rs. 800",\n          "notes": "A sweet treat for the afternoon."\n        },\n        {\n          "name": "Montmartre",\n          "description": "Visit the Sacré-Coeur Basilica, explore the artistic neighborhood, and enjoy street performers.",\n          "duration": "3 hours",\n          "cost": "Free",\n          "notes": "Experience the bohemian charm of Montmartre."\n        },\n        {\n          "name": "Dinner at Le Bistrot du Coin",\n          "description": "Savor authentic French cuisine in a cozy and traditional bistro in Montmartre.",\n          "duration": "1.5 hours",\n          "cost": "Rs. 1000",\n          "notes": "Enjoy the local flavors in a relaxed setting."\n        }\n      ]\n    },\n    {\n      "day": 5,\n      "theme": "Departure & Fond Memories",\n      "activities": [\n        {\n          "name": "Breakfast at Hotel",\n          "description": "Enjoy a continental breakfast at the hotel.",\n          "duration": "1 hour",\n          "cost": "Included in accommodation",\n          "notes": "A light and refreshing start to the day."\n        },\n        {\n          "name": "Last Stroll through Paris",\n          "description": "Relaxing walk through Tuileries Garden or along the Seine.",\n          "duration": "2 hours",\n          "cost": "Free",\n          "notes": "Take in the beauty of Paris one last time."\n        },\n        {\n          "name": "Transfer to Airport",\n          "description": "Taxi or RER B to CDG Airport.",\n          "duration": "1 hour",\n          "cost": "Taxi: Rs. 1500, RER B: Rs. 250",\n          "notes": "Allow ample time for check-in and security."\n        },\n        {\n          "name": "Flight back Home",\n          "description": "Departure from CDG Airport.",\n          "duration": "As per flight schedule",\n          "cost": "Variable, depends on flight booking",\n          "notes": "Cherish the memories of your Parisian adventure."\n        }\n      ]\n    }\n  ]\n}\n```\n',
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  const AItrip = parseResponse(result.response.text());
  return AItrip;
}
