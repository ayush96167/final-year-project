import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBookingStore } from "../app/store/bookingStore";

export default function BookSlot() {
  const navigate = useNavigate();
  const location = useLocation();

  const station = location.state?.station;

  const bookSlot = useBookingStore((s) => s.bookSlot);
  const isSlotBooked = useBookingStore((s) => s.isSlotBooked);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!station) {
    return (
      <div className="p-8">
        <p>No station selected.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/map")}
        >
          Go Back to Map
        </button>
      </div>
    );
  }

  const slots = [
    "09:00 – 09:30",
    "09:30 – 10:00",
    "10:00 – 10:30",
    "10:30 – 11:00",
  ];

  const bookedCount =
    useBookingStore.getState().bookedSlots[station.id]?.length || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">
        🔌 Book Slot
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-md">
        <h2 className="font-semibold mb-2">
          {station.name}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Available slots:{" "}
          <span className="font-semibold">
            {station.total - bookedCount} / {station.total}
          </span>
        </p>

        <div className="space-y-2">
          {slots.map((slot) => {
            const booked = isSlotBooked(station.id, slot);

            return (
              <button
                key={slot}
                disabled={booked}
                onClick={() => setSelectedSlot(slot)}
                className={`w-full px-4 py-2 rounded border ${
                  booked
                    ? "bg-gray-300 cursor-not-allowed"
                    : selectedSlot === slot
                    ? "bg-emerald-500 text-white"
                    : "bg-white"
                }`}
              >
                {slot} {booked && "(Booked)"}
              </button>
            );
          })}
        </div>

        <button
          disabled={!selectedSlot}
          className={`mt-4 w-full px-4 py-2 rounded text-white ${
            selectedSlot
              ? "bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => {
            if (!selectedSlot) return;

            const bookingId = `EV-${Date.now()}`;

bookSlot(station.id, selectedSlot);

navigate("/receipt", {
  state: {
    bookingId,
    stationName: station.name,
    slot: selectedSlot,
    date: new Date().toLocaleString(),
  },
});

          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
