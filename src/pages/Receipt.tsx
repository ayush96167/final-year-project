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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          ⚡ Charging Slot Receipt
        </h1>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-medium">{receipt.bookingId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Station</span>
            <span className="font-medium">{receipt.stationName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Slot</span>
            <span className="font-medium">{receipt.slot}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Booked At</span>
            <span className="font-medium">{receipt.date}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded"
            onClick={() => alert("PDF download coming soon")}
          >
            Download Receipt (PDF)
          </button>

          <button
            className="w-full px-4 py-2 bg-gray-200 rounded"
            onClick={() => navigate("/map")}
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}
