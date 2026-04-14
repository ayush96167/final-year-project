import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useThemeStore } from "../../features/theme/useThemeStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer text-sm font-semibold tracking-widest text-[#1d1d1f] dark:text-white"
        >
          EV·CHARGE
        </span>

        {/* Links */}
        <div className="flex items-center gap-6 text-[13px] tracking-wide text-[#1d1d1f] dark:text-gray-200">
          <button
            onClick={() => navigate("/map")}
            className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
          >
            Find Chargers
          </button>
          
          <button
            onClick={() => navigate("/trip")}
            className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
          >
            Trip Planner
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate("/book")}
                className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
              >
                Book Slot
              </button>
              <div className="flex items-center gap-4 border-l border-black/10 dark:border-white/10 pl-4 ml-2">
                <span className="opacity-80">Hi, {user.name}</span>
                <button
                  onClick={() => logout()}
                  className="hover:text-red-500 transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-full hover:bg-[#000000] dark:hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
             onClick={toggleTheme}
             className="ml-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
             title="Toggle Dark Mode"
          >
             {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}