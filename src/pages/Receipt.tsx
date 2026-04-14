import { useLocation, useNavigate } from "react-router-dom";

export default function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();

  const receipt = location.state;

  if (!receipt) {
    return (
      <div className="p-8">
        <p>No receipt found.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/map")}
        >
          Go to Map
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#121212] flex items-center justify-center p-6 text-[#1d1d1f] dark:text-white">
      <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/10 p-8">
        <h1 className="text-2xl font-bold mb-8 text-center tracking-tight">
          ⚡ Charging Slot Receipt
        </h1>

        <div className="space-y-4 text-[15px]">
          <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Booking ID</span>
            <span className="font-semibold">{receipt.bookingId || "BKG-12948"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Station</span>
            <span className="font-semibold">{receipt.stationName || "Unknown Station"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Slot</span>
            <span className="font-semibold">{receipt.slot || "10:00 - 10:30"}</span>
          </div>

          <div className="flex justify-between pb-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Booked At</span>
            <span className="font-semibold">{receipt.date || new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            className="w-full px-4 py-3.5 bg-emerald-500 dark:bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-600 transition"
            onClick={() => alert("PDF download coming soon")}
          >
            Download Receipt (PDF)
          </button>

          <button
            className="w-full px-4 py-3.5 bg-gray-100 dark:bg-white/10 text-[#1d1d1f] dark:text-white font-medium rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition"
            onClick={() => navigate("/map")}
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}
