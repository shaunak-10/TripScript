"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface UnsplashImage {
  id: string;
  alt_description: string | null;
  urls: {
    regular: string;
  };
}

const CityPage: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("q"); // Get query parameter 'q'
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  useEffect(() => {
    if (!name) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            name
          )}&per_page=9`,
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
        console.log("Error fetching images:", error);
        setError("Error fetching images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [name]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
        Discover {name}
      </h1>
      {loading && <p>Loading images...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="grid grid-cols-3 gap-4">
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
              quality={80}
              sizes="(max-width: 300px) , (max-width: 600px) , 33vw"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default CityPage;
