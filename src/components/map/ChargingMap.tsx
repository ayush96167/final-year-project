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
    <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">
      {/* ---------------- LEFT PANEL ---------------- */}
      <div className="md:w-1/3 w-full bg-white border-r overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <h2 className="text-lg font-bold mb-2">
            Nearby Charging Stations
          </h2>
          <div className="p-4 border-b">
  <input
    type="text"
    placeholder="Search city or place..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="w-full px-3 py-2 border rounded"
  />

  <button
    className="mt-2 w-full bg-emerald-500 text-white py-1 rounded"
    onClick={async () => {
      const result = await geocodePlace(searchText);
      if (!result) return;

      setMapCenter([result.lat, result.lng]);
    }}
  >
    Search
  </button>
</div>
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
        
        <div className="p-2 space-y-3" 
        >
          {sortedStations.map((station) => (
           <div
  key={station.id}
  onClick={() => setSelectedStation(station)}
  className={`cursor-pointer p-4 rounded-lg border shadow-sm transition ${
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
      <div className="md:w-2/3 w-full relative bg-black/20 p-2">
      {loading && (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white px-4 py-2 rounded shadow">
        Loading charging stations…
      </div>
    </div>
  )}
        <MapContainer
        
          center={[28.6139, 77.209]}
          zoom={12}
          className="w-full h-full  rounded-xl shadow-lg"
          
        >
          <RecenterMap center={mapCenter} />
          <MapEvents
              onMove={(lat, lng) => {
                setMapCenter([lat, lng]);
              }}
              onZoom={(zoom) => {
                if (zoom >= 13) setRadiusKm(10);
                else if (zoom >= 11) setRadiusKm(25);
                else setRadiusKm(50);
              }}
            />
            
          
          <TileLayer
  attribution="© OpenStreetMap contributors"
  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
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

          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
           >
  {sortedStations.map((station) => (
    <Marker
      key={station.id}
      position={[station.lat, station.lng]}
      icon={getMarkerIcon(station.available, station.total)}
      eventHandlers={{
        click: () => {
          setSelectedStation(station);
        },
      }}
    >
      <Popup>
        <div className="w-56 text-sm">
          <h3 className="font-semibold text-base mb-1">
            {station.name}
          </h3>

          <p className="text-gray-400 text-xs mb-2">
            ⚡ {station. powerKW || "N/A"} kW
          </p>

          <div className="flex justify-between text-xs mb-2">
            <span>Slots</span>
            <span className="font-medium">
              {station.available}/{station.total}
            </span>
          </div>

          <button
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white py-1 rounded text-sm"
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
</MarkerClusterGroup>
        </MapContainer>
        {selectedStation && (
  <div className="absolute right-0 top-14 h-[calc(100%-56px)] w-full md:w-96 bg-white border-l shadow-xl z-[1000] overflow-y-auto">
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="font-bold text-lg">
        {selectedStation.name}
      </h2>

      <button
        className="text-gray-500 hover:text-black"
        onClick={() => setSelectedStation(null)}
      >
        ✕
      </button>
    </div>

    <div className="p-4 space-y-4 text-sm">
      <div>
        <p className="text-gray-500">Distance</p>
        <p>{selectedStation.distance.toFixed(2)} km</p>
      </div>

      <div>
        <p className="text-gray-500">Max Power</p>
        <p>⚡ {selectedStation.powerKW || "N/A"} kW</p>
      </div>

      <div>
        <p className="text-gray-500">Connectors</p>
        <ul className="list-disc ml-5">
          {(selectedStation.connectorTypes || []).map(
            (type: string, i: number) => (
              <li key={i}>{type}</li>
            )
          )}
        </ul>
      </div>

      <div>
        <p className="text-gray-500">Status</p>
        <span
          className={`inline-block px-2 py-1 rounded text-xs ${
            selectedStation.isOperational
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {selectedStation.isOperational
            ? "Operational"
            : "Unavailable"}
        </span>
      </div>

      <button
        className="w-full py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        onClick={() =>
          navigate("/book", {
            state: { station: selectedStation },
          })
        }
      >
        Book Slot
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
