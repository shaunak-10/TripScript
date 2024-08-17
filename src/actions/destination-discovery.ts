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
  maxOutputTokens: 1000000,
  responseMimeType: "application/json",
};

export async function destinationDiscovery(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "I am working on a destination discovery module for a trip planner project. On the destination page, I would like to include detailed information to help users decide where to visit. The page should feature key details about the destination such as the best time to visit, local customs, safety information, transportation options, popular landmarks, cultural experiences, and recommended activities. Please generate this information in JSON format.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `{
  "city": "Mumbai",
  "best_time_to_visit": {
    "description": "The best time to visit Mumbai depends on your tolerance for heat and humidity. The winter months offer the most pleasant weather, while the monsoon season brings heavy rainfall but also a unique charm.",
    "seasons": [
      {
        "season": "Winter (October-February)",
        "description": "Pleasant temperatures, low humidity, ideal for sightseeing and outdoor activities."
      },
      {
        "season": "Summer (March-May)",
        "description": "Hot and humid, best for indoor activities and exploring the city's vibrant nightlife."
      },
      {
        "season": "Monsoon (June-September)",
        "description": "Heavy rainfall, but also a unique charm, with lush greenery and fewer crowds. Ideal for experiencing Mumbai's resilience and cultural events."
      }
    ]
  },
  "local_customs_and_culture": {
    "greetings": "Common greetings include 'Namaste' (with a slight bow), 'Hello', and 'Good morning/afternoon/evening'.",
    "etiquette": "Mumbai is a vibrant and diverse city, with a mix of cultures and traditions. It's important to be respectful of local customs and dress modestly when visiting religious sites.",
    "dress_code": "Comfortable clothing is suitable for most activities, but avoid revealing attire. Modest dress is recommended for religious sites and during festivals.",
    "food_and_drink": "Mumbai is a foodie's paradise, with a wide variety of cuisines, from street food to fine dining. It's customary to tip in restaurants and cafes.",
    "religious_practices": "Mumbai is home to people from various religious backgrounds, including Hinduism, Islam, Christianity, and Sikhism. Be respectful of their beliefs and practices."
  },
  "safety_tips": {
    "general": "Mumbai is generally safe, but it's important to be aware of your surroundings and take precautions against petty theft, especially in crowded areas.",
    "crime": "Be cautious of pickpockets in crowded areas, particularly around tourist attractions. Keep valuables secure and avoid displaying large amounts of cash.",
    "traffic": "Mumbai has heavy traffic, so be prepared for delays. Use public transport or taxis to get around. Exercise caution when crossing roads, especially during peak hours.",
    "health": "Consult with your doctor about necessary vaccinations and travel insurance. Drink bottled water and avoid consuming uncooked food from street vendors.",
    "emergency_numbers": "Keep emergency numbers handy, including police (100), fire (101), and ambulance (102)."
  },
  "transportation": {
    "options": [
      {
        "mode": "Local Trains",
        "description": "The most efficient and affordable way to travel within Mumbai. Expect crowded conditions during peak hours."
      },
      {
        "mode": "Buses",
        "description": "A more comfortable option than trains, with various routes covering the city."
      },
      {
        "mode": "Taxis and Auto-rickshaws",
        "description": "Readily available for shorter distances, but negotiate the fare beforehand."
      },
      {
        "mode": "Ride-sharing services",
        "description": "Convenient options for getting around, including Uber, Ola, and others."
      },
      {
        "mode": "Walking",
        "description": "Great for exploring the city's neighborhoods and markets, but be aware of traffic and safety."
      }
    ]
  },
  "landmarks_and_attractions": {
    "popular_landmarks": [
      {
        "name": "Gateway of India",
        "description": "An iconic archway, a symbol of Mumbai, marking the entrance to the harbor."
      },
      {
        "name": "Chhatrapati Shivaji Maharaj Terminus",
        "description": "A UNESCO World Heritage Site, a beautiful Victorian-era railway station."
      },
      {
        "name": "Elephanta Caves",
        "description": "Ancient rock-cut cave temples dedicated to Shiva, accessible by boat from the Gateway of India."
      },
      {
        "name": "Marine Drive",
        "description": "A scenic promenade along the Arabian Sea, also known as the 'Queen's Necklace'."
      },
      {
        "name": "Dhobi Ghat",
        "description": "A unique open-air laundry where thousands of clothes are washed and dried each day."
      }
    ],
    "other_attractions": [
      {
        "name": "Mani Bhavan",
        "description": "The former residence of Mahatma Gandhi, where he stayed during his fight for India's independence."
      },
      {
        "name": "Kanheri Caves",
        "description": "Ancient Buddhist cave temples carved into the hills of Sanjay Gandhi National Park."
      },
      {
        "name": "National Gallery of Modern Art",
        "description": "A museum showcasing Indian art from the 19th century to the present day."
      },
      {
        "name": "Juhu Beach",
        "description": "A popular beach known for its street food, kite flying, and sunset views."
      },
      {
        "name": "Bandra-Worli Sea Link",
        "description": "A scenic bridge connecting Bandra and Worli, offering panoramic views of the city."
      }
    ]
  },
  "cultural_experiences": {
    "unique_activities": [
      {
        "activity": "Experience the Dabbawala system",
        "description": "Witness the unique and efficient lunch delivery system, where thousands of tiffin carriers are transported across the city."
      },
      {
        "activity": "Visit a Bollywood studio",
        "description": "Get a glimpse of the magic of Bollywood by visiting a studio and learning about the film industry."
      },
      {
        "activity": "Attend a traditional Indian dance performance",
        "description": "Experience the beauty and artistry of Indian classical dance forms like Bharatanatyam or Kathak."
      },
      {
        "activity": "Explore the vibrant street food scene",
        "description": "Sample the delicious and diverse street food of Mumbai, from vada pav to pani puri."
      },
      {
        "activity": "Visit a local market",
        "description": "Experience the bustling atmosphere of a local market, like Crawford Market or Chor Bazaar, and browse through a variety of goods."
      }
    ],
    "events_and_festivals": [
      {
        "event": "Ganesh Chaturthi",
        "description": "A 10-day festival celebrating the Hindu god Ganesha, featuring elaborate processions and idol immersions."
      },
      {
        "event": "Diwali",
        "description": "The festival of lights, celebrated with fireworks, lights, and sweets."
      },
      {
        "event": "Navratri",
        "description": "A nine-night festival celebrating the victory of good over evil, featuring traditional dance performances and colorful costumes."
      },
      {
        "event": "Mumbai Film Festival",
        "description": "An annual film festival showcasing a diverse selection of movies from around the world."
      },
      {
        "event": "Kala Ghoda Arts Festival",
        "description": "A month-long festival celebrating art, culture, and music, held in the Kala Ghoda neighborhood."
      }
    ]
  },
  "day_trips_and_excursions": {
    "destinations": [
      {
        "destination": "Lonavala and Khandala",
        "description": "Hill stations located near Mumbai, offering scenic views, waterfalls, and hiking trails."
      },
      {
        "destination": "Alibaug",
        "description": "A coastal town known for its beaches, resorts, and historical forts."
      },
      {
        "destination": "Matheran",
        "description": "A hill station known for its unique car-free environment, scenic views, and hiking trails."
      },
      {
        "destination": "Karjat",
        "description": "A town near Mumbai, popular for its trekking trails, waterfalls, and scenic landscapes."
      },
      {
        "destination": "Pune",
        "description": "A bustling city known for its historical sites, cultural attractions, and vibrant nightlife."
      }
    ]
  }
}
content_copy
Use code with caution.
Json`,
          },
        ],
      },
    ],
  });
  console.log("Destination Discovery prompt:", prompt);
  const result = await chatSession.sendMessage(prompt);
  return JSON.parse(result.response.text());
}
