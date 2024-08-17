"use client";
import { useState, FormEvent } from "react";
import Image from "next/image";

interface UnsplashImage {
  id: string;
  alt_description: string | null;
  urls: {
    regular: string;
  };
}

const SearchPage: React.FC = () => {
  const [place, setPlace] = useState<string>("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const accessKey = "qEfHjaMeZgXqEZoORbPO6bY3Bv1RsL3wLnOa3_eu42g"; // Replace with your Unsplash API key

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!place.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          place
        )}&per_page=10`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search for Tourist Place Images</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Enter a place name..."
          style={{ padding: "10px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading images...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            style={{ position: "relative", width: "100%", height: "300px" }}
          >
            <Image
              src={image.urls.regular}
              alt={image.alt_description || "Tourist Place Image"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
