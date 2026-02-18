import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="h-14 bg-gray-900 text-white flex items-center justify-between px-6">
      <h1 className="font-bold text-lg">⚡ EV Charge</h1>

      <div className="space-x-4 text-sm">
        <Link to="/map" className="hover:text-emerald-400">
          Map
        </Link>
        <Link to="/trip" className="hover:text-emerald-400">
          Trip Planner
        </Link>
      </div>
    </div>
  );
}
