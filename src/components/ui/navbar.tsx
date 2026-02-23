import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isHome ? "bg-transparent" : "bg-white shadow-sm"}
      `}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className={`cursor-pointer text-sm font-semibold tracking-widest
            ${isHome ? "text-white" : "text-black"}
          `}
        >
          EV·CHARGE
        </span>

        {/* Links */}
        <div
          className={`flex gap-8 text-sm font-medium
            ${isHome ? "text-white" : "text-gray-800"}
          `}
        >
          <button
            onClick={() => navigate("/map")}
            className="hover:opacity-70 transition"
          >
            Find Chargers
          </button>

          <button
            onClick={() => navigate("/book")}
            className="hover:opacity-70 transition"
          >
            Book Slot
          </button>
        </div>
      </div>
    </nav>
  );
}