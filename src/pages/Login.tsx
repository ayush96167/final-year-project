import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../features/auth/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login({ id: "1", name: email.split("@")[0] || "User", email });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfbfd] dark:bg-[#121212] flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px] z-10 px-6"
      >
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200/60 dark:border-white/10 rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Sign in to EV·CHARGE</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-[#1d1d1f] dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0071e3] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0071e3] dark:focus:ring-emerald-500 transition-colors placeholder:text-gray-400 text-[15px]"
                placeholder="Email or Account Name"
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-[#1d1d1f] dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0071e3] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0071e3] dark:focus:ring-emerald-500 transition-colors placeholder:text-gray-400 text-[15px]"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0071e3] dark:bg-emerald-500 text-white font-medium rounded-full px-4 py-3.5 hover:bg-[#0077ED] dark:hover:bg-emerald-400 transition-colors mt-6 text-[15px]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#1d1d1f] dark:text-gray-400">
            Don't have an EV·CHARGE ID?{" "}
            <Link to="/register" className="text-[#0071e3] dark:text-emerald-400 hover:underline">
              Create yours now.
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
