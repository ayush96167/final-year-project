import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChargingStations } from "../../services/openChargeMap";
import { normalizeOCMStation } from "../../utils/normalizeOCMStation";
import { geocodePlace } from "../../services/geocode";
import { useMapEvents } from "react-leaflet";
import { greenIcon, yellowIcon, redIcon } from "./markerIcons";
import { haversineDistance } from "../../utils/geo";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../../styles/cluster.css";

/* ------------------ CONFIG ------------------ */
const MAX_RANGE_KM = 300;

/* ------------------ HELPERS ------------------ */
function getMarkerIcon(available: number, total: number) {
  if (available === 0) return redIcon;
  if (available / total <= 0.3) return yellowIcon;
  return greenIcon;
}
function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [center]);

  return null;
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
  powerKW: string;
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
  const [searchText, setSearchText] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  function MapEvents({
  onMove,
  onZoom,
}: {
  onMove: (lat: number, lng: number) => void;
  onZoom: (zoom: number) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMove(center.lat, center.lng);
    },
    zoomend: (e) => {
      onZoom(e.target.getZoom());
    },
  });

  return null;
}
  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);

      try {
        setLoading(true); // 🔵 START LOADING

        const [lat, lng] = mapCenter ?? [latitude, longitude];

        const rawStations = await fetchChargingStations(
          lat,
          lng,
          radiusKm
        );

        const normalizedStations =
          rawStations.map(normalizeOCMStation);

        let nearestId: number | null = null;
        let minDistance = Infinity;

        const enriched = normalizedStations.map((station: any) => {
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
        });

        enriched.sort((a: any, b: any) => a.score - b.score);

        setNearestStationId(nearestId);
        setSortedStations(enriched);

      } catch (err) {
        console.error("OpenChargeMap fetch failed", err);
      } finally {
        setLoading(false); // 🟢 ALWAYS STOP LOADING
      }
    },
    () => console.error("Location permission denied")
  );
}, [battery, mapCenter, radiusKm]);

return (
  <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] bg-gradient-to-br from-black via-gray-900 to-black text-white">

    {/* ---------------- LEFT PANEL ---------------- */}
    <div className="md:w-1/3 w-full h-full p-6">
      <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col">

        {/* Sticky header */}
        <div className="sticky top-0 z-10 p-6 border-b border-white/10 space-y-6">
          <h2 className="text-lg font-semibold tracking-wide">
            Nearby Charging Stations
          </h2>

          {/* SEARCH */}
          <div>
            <input
              type="text"
              placeholder="Search city or place..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-emerald-400 transition"
            />

            <button
              className="mt-3 w-full py-3 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
              onClick={async () => {
                const result = await geocodePlace(searchText);
                if (!result) return;
                setMapCenter([result.lat, result.lng]);
              }}
            >
              Search
            </button>
          </div>

          {/* BATTERY */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Battery</span>
              <span className="text-emerald-400 font-medium">
                {battery}%
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={100}
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />

            {battery < 25 && (
              <p className="text-xs text-red-400 mt-2">
                Low battery — smart recommendations enabled
              </p>
            )}
          </div>
        </div>

        {/* Station cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedStations.map((station) => (
            <div
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 ${
                station.id === nearestStationId
                  ? "border-emerald-400 bg-emerald-500/10"
                  : "border-white/10 bg-black/40 hover:border-white/30 hover:scale-[1.01]"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">
                  {station.name}
                </h3>

                {station.id === nearestStationId && (
                  <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                    Nearest
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {station.distance?.toFixed(2)} km away
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">
                  Slots{" "}
                  <strong className="text-emerald-400">
                    {station.available}/{station.total}
                  </strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/book", { state: { station } });
                  }}
                  className="px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-gray-200 transition"
                >
                  Book
                </button>
              </div>

              {!station.reachable && (
                <p className="text-xs text-red-400 mt-3">
                  ⚠ Might not reach with current battery
                </p>
              )}

              {station.reachable && battery < 25 && (
                <p className="text-xs text-emerald-400 mt-3">
                  ✅ Recommended for you
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ---------------- MAP ---------------- */}
    <div className="md:w-2/3 w-full p-4">
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        {/* Your MapContainer goes here */}
      </div>
    </div>

  </div>
);