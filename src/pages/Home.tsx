import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        ⚡ EV Charging Slot Booking System
      </h1>

      <div className="space-x-4">
        <Link
          to="/map"
          className="px-4 py-2 bg-emerald-500 text-white rounded"
        >
          View Stations
        </Link>

        <Link
          to="/trip"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Plan Trip
        </Link>
      </div>
    </div>
  );
}
