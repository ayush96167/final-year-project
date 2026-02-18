import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { chargingStations } from "../../data/stations";
import { greenIcon, yellowIcon, redIcon } from "./markerIcons";
import { haversineDistance } from "../../utils/geo";

/* ------------------ CONFIG ------------------ */
const MAX_RANGE_KM = 300;

/* ------------------ HELPERS ------------------ */
function getMarkerIcon(available: number, total: number) {
  if (available === 0) return redIcon;
  if (available / total <= 0.3) return yellowIcon;
  return greenIcon;
}

function canReach(distance: number, battery: number) {
  const usableRange = (battery / 100) * MAX_RANGE_KM;
  return distance <= usableRange * 0.9;
}

function stationScore(
  distance: number,
  available: number,
  total: number,
  battery: number
) {
  const congestion = 1 - available / total;
  const batteryRisk = battery < 25 ? distance / 50 : 0;
  return distance * 0.5 + congestion * 30 + batteryRisk * 20;
}

/* ------------------ TYPES ------------------ */
type StationWithDistance = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  distance: number;
  reachable: boolean;
  score: number;
};

/* ------------------ COMPONENT ------------------ */
export default function ChargingMap() {
  const navigate = useNavigate();

  const [battery, setBattery] = useState(50);
  const [userLocation, setUserLocation] =
    useState<[number, number] | null>(null);
  const [nearestStationId, setNearestStationId] =
    useState<number | null>(null);
  const [sortedStations, setSortedStations] =
    useState<StationWithDistance[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        let nearestId: number | null = null;
        let minDistance = Infinity;

        const enriched: StationWithDistance[] = chargingStations.map(
          (station) => {
            const distance = haversineDistance(
              latitude,
              longitude,
              station.lat,
              station.lng
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestId = station.id;
            }

            return {
              ...station,
              distance,
              reachable: canReach(distance, battery),
              score: stationScore(
                distance,
                station.available,
                station.total,
                battery
              ),
            };
          }
        );

        enriched.sort((a, b) => a.score - b.score);
        setNearestStationId(nearestId);
        setSortedStations(enriched);
      },
      () => console.error("Location access denied")
    );
  }, [battery]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">
      {/* ---------------- LEFT PANEL ---------------- */}
      <div className="md:w-1/3 w-full bg-white border-r overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <h2 className="text-lg font-bold mb-2">
            Nearby Charging Stations
          </h2>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Battery</span>
              <span className="font-medium">{battery}%</span>
            </div>

            <input
              type="range"
              min={5}
              max={100}
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />

            {battery < 25 && (
              <p className="text-xs text-red-500 mt-1">
                Low battery — smart recommendations enabled
              </p>
            )}
          </div>
        </div>

        {/* Station cards */}
        <div className="p-2 space-y-3">
          {sortedStations.map((station) => (
            <div
              key={station.id}
              className={`p-4 rounded-lg border shadow-sm transition ${
                station.id === nearestStationId
                  ? "border-emerald-400 bg-emerald-50"
                  : "hover:shadow-md bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">
                  {station.name}
                </h3>

                {station.id === nearestStationId && (
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                    Nearest
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {station.distance.toFixed(2)} km away
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">
                  Slots{" "}
                  <strong>
                    {station.available}/{station.total}
                  </strong>
                </span>

                <button
                  onClick={() =>
                    navigate("/book", { state: { station } })
                  }
                  className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                  Book
                </button>
              </div>

              {!station.reachable && (
                <p className="text-xs text-red-500 mt-2">
                  ⚠ Might not reach with current battery
                </p>
              )}

              {station.reachable && battery < 25 && (
                <p className="text-xs text-emerald-600 mt-2">
                  ✅ Recommended for you
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- MAP ---------------- */}
      <div className="md:w-2/3 w-full">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={12}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <CircleMarker
              center={userLocation}
              radius={8}
              pathOptions={{ color: "blue" }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}

          {chargingStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={getMarkerIcon(station.available, station.total)}
            >
              <Popup>
                <div className="text-sm space-y-2">
                  <h3 className="font-bold">{station.name}</h3>
                  <p>
                    Slots: {station.available} / {station.total}
                  </p>
                  <button
                    className="px-3 py-1 bg-emerald-500 text-white rounded text-sm"
                    onClick={() =>
                      navigate("/book", { state: { station } })
                    }
                  >
                    Book Slot
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
