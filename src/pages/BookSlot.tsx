import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

// SVG Icons to avoid dependency
function SunIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  );
}
function SunriseIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="m8.4 10.4-4.2-4.2"/><path d="m15.6 10.4 4.2-4.2"/><path d="M22 22H2"/><path d="M8 22v-3a4 4 0 0 1 8 0v3"/></svg>
  );
}
function SunsetIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10V2"/><path d="m11.4 10.6-4.2-4.2"/><path d="m12.6 10.6 4.2-4.2"/><path d="M22 22H2"/><path d="M8 22v-3a4 4 0 0 1 8 0v3"/></svg>
  );
}
function MoonIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );
}

const periods = [
  { id: "Morning", icon: SunriseIcon },
  { id: "Noon", icon: SunIcon },
  { id: "Evening", icon: SunsetIcon },
  { id: "Night", icon: MoonIcon },
];

const periodSlots: Record<string, string[]> = {
  Morning: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  Noon: ["12:00", "13:00", "14:00", "15:00", "16:00"],
  Evening: ["17:00", "18:00", "19:00", "20:00"],
  Night: ["21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
};

export default function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();

  const station = location.state?.station;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Morning");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dates = generateDates();

  if (!station) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#121212] flex items-center justify-center text-[#1d1d1f] dark:text-white">
        <p>No station selected.</p>
      </div>
    );
  }

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId);
    setSelectedSlot(null);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#121212] text-[#1d1d1f] dark:text-white pt-24 pb-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Book Charging Slot
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            {station.name}
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
        >
          {/* STATION HEADER IN CARD */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-white/10">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
                Availability
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0071e3] dark:text-emerald-400 leading-none">
                  {station.available}
                </span>
                <span className="text-gray-400 text-lg font-medium">/ {station.total}</span>
                <span className="text-gray-500 text-base font-medium ml-1">ports available</span>
              </div>
            </div>
            <span className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
              Operational
            </span>
          </div>

          {/* DATE PICKER */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#0071e3] dark:bg-emerald-400 rounded-full inline-block"></span>
              Select Date {/* Let's disable native scrollbars for a cleaner look natively with custom class or inline styles. But tailwind works. */}
            </h3>
            <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 scrollbar-hide -mx-2 px-2">
              {dates.map((date, idx) => {
                const isSelected = selectedDate.toDateString() === date.toDateString();
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = date.getDate();
                const monthName = date.toLocaleDateString("en-US", { month: "short" });
                
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateChange(date)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-[#0071e3] dark:bg-emerald-500/20 border-[#0071e3] dark:border-emerald-400 text-white shadow-md shadow-[#0071e3]/20 dark:shadow-none"
                        : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-[#1d1d1f] dark:text-gray-300"
                    }`}
                  >
                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${isSelected ? "text-blue-100 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {dayName}
                    </span>
                    <span className={`text-2xl font-bold my-1 ${isSelected ? "text-white" : "text-[#1d1d1f] dark:text-white"}`}>
                      {dayNum}
                    </span>
                    <span className={`text-xs font-medium ${isSelected ? "text-blue-100 dark:text-emerald-400/80" : "text-gray-400"}`}>
                      {monthName}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* TIME PERIOD TABS */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#0071e3] dark:bg-emerald-400 rounded-full inline-block"></span>
              Time Period
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-black/20 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
              {periods.map((period) => {
                const isSelected = selectedPeriod === period.id;
                const Icon = period.icon;
                return (
                  <button
                    key={period.id}
                    onClick={() => handlePeriodChange(period.id)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-semibold ${
                      isSelected
                        ? "bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-emerald-400 shadow-[0_2px_10px_rgb(0,0,0,0.05)] border border-gray-200/50 dark:border-white/10"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#1d1d1f] dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {period.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SLOTS GRID */}
          <div className="mb-10 min-h-[160px]">
             <motion.div
               key={selectedPeriod}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
             >
                {periodSlots[selectedPeriod].map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3.5 px-2 rounded-xl border transition-all text-center ${
                        isSelected
                          ? "bg-[#0071e3] dark:bg-emerald-500/20 border-[#0071e3] dark:border-emerald-400 text-white dark:text-emerald-300 shadow-md"
                          : "bg-white dark:bg-[#1a1a1c] border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 text-[#1d1d1f] dark:text-white"
                      }`}
                    >
                      <p className="font-semibold text-lg">{slot}</p>
                    </motion.button>
                  );
                })}
             </motion.div>
          </div>

          {/* CONFIRM BUTTON */}
          <div className="pt-8 border-t border-gray-100 dark:border-white/10">
            <motion.button
              whileHover={{ scale: selectedSlot ? 1.01 : 1 }}
              whileTap={{ scale: selectedSlot ? 0.98 : 1 }}
              disabled={!selectedSlot}
              className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedSlot
                  ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] hover:bg-black dark:hover:bg-gray-100 shadow-[0_8px_20px_rgb(0,0,0,0.15)] dark:shadow-none"
                  : "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
              onClick={() => {
                if (selectedSlot) {
                  navigate("/receipt", {
                    state: {
                      station,
                      date: selectedDate.toISOString(),
                      period: selectedPeriod,
                      slot: selectedSlot
                    }
                  });
                }
              }}
            >
              <span>{selectedSlot ? `Book for ${selectedSlot}` : "Select a time slot"}</span>
              {selectedSlot && (
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}