import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();

  const station = location.state?.station;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!station) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No station selected.</p>
      </div>
    );
  }

  const slots = [
    "09:00 – 09:30",
    "09:30 – 10:00",
    "10:00 – 10:30",
    "10:30 – 11:00",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Book Charging Slot
        </h1>

        <p className="mt-2 text-gray-400">
          {station.name}
        </p>

        {/* GLASS CARD */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
        >
          {/* STATION INFO */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-400 text-sm">Available Slots</p>
              <p className="text-lg font-medium">
                {station.available} / {station.total}
              </p>
            </div>

            <span className="px-4 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
              Operational
            </span>
          </div>

          {/* SLOT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <motion.button
                key={slot}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedSlot(slot)}
                className={`px-6 py-4 rounded-xl border transition text-left ${
                  selectedSlot === slot
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <p className="font-medium">{slot}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Fast Charging Available
                </p>
              </motion.button>
            ))}
          </div>

          {/* CONFIRM BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!selectedSlot}
            className={`mt-8 w-full py-4 rounded-full text-lg font-medium transition ${
              selectedSlot
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => navigate("/receipt")}
          >
            Confirm Booking
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}