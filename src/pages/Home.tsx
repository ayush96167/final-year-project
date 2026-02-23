import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Smart EV Charging",
    subtitle: "Find. Plan. Charge.",
    description:
      "Discover EV charging stations worldwide and book slots instantly.",
  },
  {
    title: "Charge Anywhere",
    subtitle: "Global Charging Network",
    description:
      "Explore thousands of charging stations across cities and countries.",
  },
  {
    title: "Book Instantly",
    subtitle: "No Waiting. No Guesswork.",
    description:
      "Reserve charging slots with real-time availability.",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden">
      <div className="relative h-full flex items-center justify-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight transition-all duration-500">
            {slides[index].title}
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-gray-300">
            {slides[index].subtitle}
          </p>

          <p className="mt-6 text-gray-400">
            {slides[index].description}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/map")}
              className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
            >
              Find Chargers
            </button>

            <button
              onClick={() => navigate("/book")}
              className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition"
            >
              Book Slot
            </button>
          </div>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-10 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}