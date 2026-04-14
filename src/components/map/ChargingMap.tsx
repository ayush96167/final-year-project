import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-cluster";
import { motion, AnimatePresence } from "framer-motion";

import { fetchChargingStations } from "../../services/openChargeMap";
import { normalizeOCMStation } from "../../utils/normalizeOCMStation";
import { geocodePlace } from "../../services/geocode";
import { haversineDistance } from "../../utils/geo";
import { useThemeStore } from "../../features/theme/useThemeStore";
import { greenIcon, yellowIcon, redIcon } from "./markerIcons";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../../styles/cluster.css";

/* ---------------- CONFIG ---------------- */
const MAX_RANGE_KM = 300;

/* ---------------- HELPERS ---------------- */
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

/* ---------------- MAP HELPERS ---------------- */
function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
}

function MapEvents({
  onMove,
  onZoom,
}: {
  onMove: (lat: number, lng: number) => void;
  onZoom: (zoom: number) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMove(c.lat, c.lng);
    },
    zoomend: (e) => {
      onZoom(e.target.getZoom());
    },
  });
  return null;
}

/* ---------------- TYPES ---------------- */
type StationWithDistance = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  powerKW?: string;
  distance: number;
  reachable: boolean;
  score: number;
};

/* ---------------- COMPONENT ---------------- */
export default function ChargingMap() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const [battery, setBattery] = useState(50);
  const [userLocation, setUserLocation] =
    useState<[number, number] | null>(null);
  const [sortedStations, setSortedStations] =
    useState<StationWithDistance[]>([]);
  const [nearestStationId, setNearestStationId] =
    useState<number | null>(null);

  const [searchText, setSearchText] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);

  // Manual Routing State
  const [isManualRouting, setIsManualRouting] = useState(false);
  const [manualStart, setManualStart] = useState("");
  const [manualDest, setManualDest] = useState("");
  const [customFromLocation, setCustomFromLocation] = useState<[number, number] | null>(null);

  const activeOrigin = isManualRouting && customFromLocation ? customFromLocation : userLocation;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Only set the GPS if we haven't overridden it, or just keep it tracked in state
        setUserLocation([latitude, longitude]);
        
        // Pan to user location initially
        if (!mapCenter) {
          setMapCenter([latitude, longitude]);
        }
      },
      () => console.error("Location denied")
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount for geolocation tracking

  // We split the station fetching into its own effect dependent on activeOrigin / mapCenter
  useEffect(() => {
    const fetchStations = async () => {
      // Determine origin coordinates for distance calc
      // If we don't have a specific origin, use the map center instead of 0,0
      const originLat = activeOrigin ? activeOrigin[0] : mapCenter?.[0];
      const originLng = activeOrigin ? activeOrigin[1] : mapCenter?.[1];

      // Return if neither activeOrigin nor mapCenter are established
      if (originLat === undefined || originLng === undefined) return;

      try {
        setLoading(true);

        const latToFetch = mapCenter ? mapCenter[0] : originLat;
        const lngToFetch = mapCenter ? mapCenter[1] : originLng;

        const raw = await fetchChargingStations(latToFetch, lngToFetch, radiusKm);
        const normalized = raw.map(normalizeOCMStation);

        let nearestId: number | null = null;
        let minDistance = Infinity;

        const enriched = normalized.map((s: any) => {
          const d = haversineDistance(originLat, originLng, s.lat, s.lng);
          if (d < minDistance) {
            minDistance = d;
            nearestId = s.id;
          }

          return {
            ...s,
            distance: d,
            reachable: canReach(d, battery),
            score: stationScore(d, s.available, s.total, battery),
          };
        });

        enriched.sort((a: any, b: any) => a.score - b.score);
        setNearestStationId(nearestId);
        setSortedStations(enriched);
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [battery, mapCenter, radiusKm, activeOrigin]);

  /* ---------------- ROUTING FETCH ---------------- */
  useEffect(() => {
    if (!activeOrigin || !navigationTarget) {
      setRouteCoords(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const [lat1, lng1] = activeOrigin;
        const [lat2, lng2] = navigationTarget;
        
        // OSRM expects longitude, latitude
        const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates;
          // GeoJSON gives [lng, lat], Leaflet needs [lat, lng]
          const latLngs = coords.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoords(latLngs);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [activeOrigin, navigationTarget]);

  /* ---------------- UI ---------------- */
  const mapTileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full h-full overflow-hidden text-[#1d1d1f] dark:text-gray-100 bg-[#fbfbfd] dark:bg-[#121212]">
      
      {loading && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md shadow-md text-[#1d1d1f] dark:text-white px-6 py-2 rounded-full text-[13px] z-[1000] font-medium border border-black/5 dark:border-white/10">
          Loading stations…
        </div>
      )}

      {/* FULL SCREEN MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={12}
          className="w-full h-full"
          zoomControl={false} 
        >
          <RecenterMap center={mapCenter} />

          <MapEvents
            onMove={(lat, lng) => setMapCenter([lat, lng])}
            onZoom={(z) => {
              if (z >= 13) setRadiusKm(10);
              else if (z >= 11) setRadiusKm(25);
              else setRadiusKm(50);
            }}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapTileUrl}
          />

          {/* ACTIVE ORIGIN (GPS or Manual) */}
          {activeOrigin && (
            <CircleMarker
              center={activeOrigin}
              radius={8}
              pathOptions={{ color: "white", fillColor: "#0071e3", fillOpacity: 0.9, weight: 2 }}
            />
          )}

          {routeCoords && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#0071e3', weight: 5, opacity: 0.8 }}
            />
          )}

          <MarkerClusterGroup>
            {sortedStations.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={getMarkerIcon(s.available, s.total)}
                eventHandlers={{
                  click: () => setSelectedStation(s),
                }}
              >
                <Popup className="rounded-xl font-sans">
                  <div className="p-1">
                    <strong className="block text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{s.name}</strong>
                    <div className="mt-2 text-[13px] text-gray-600">
                      Available: <span className="text-[#0071e3] font-medium">{s.available}/{s.total}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/book", { state: { station: s } })}
                        className="mt-3 flex-1 px-3 py-1.5 bg-[#0071e3] text-white text-[13px] rounded-full hover:bg-[#0077ED] transition-colors"
                      >
                        Book Slot
                      </button>
                      <button
                        onClick={() => setNavigationTarget([s.lat, s.lng])}
                        className="mt-3 flex-1 px-3 py-1.5 bg-white text-[#0071e3] border border-[#0071e3] text-[13px] rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* FLOATING GLASS SIDEBAR */}
      <div 
        className="absolute top-20 left-4 bottom-8 z-10 flex items-start"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* The Trigger Tab */}
        <motion.div 
          animate={{ x: isSidebarHovered ? -100 : 0, opacity: isSidebarHovered ? 0 : 1 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="absolute left-0 top-0 mt-4 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg rounded-2xl p-3 cursor-pointer flex items-center justify-center pointer-events-auto hover:bg-white dark:hover:bg-[#222] transition-colors"
        >
          <span className="text-[20px]">🔍</span>
        </motion.div>

        {/* The Actual Panel */}
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: isSidebarHovered ? 0 : -400, opacity: isSidebarHovered ? 1 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="w-[360px] h-full pointer-events-auto"
        >
          <div className="h-full bg-white/75 dark:bg-[#121212]/75 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/5 pb-5">
              
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Stations
                </h2>
                {/* Auto/Manual Toggle */}
                <div className="flex bg-black/5 dark:bg-white/5 rounded-full p-1 shadow-inner">
                  <button 
                    onClick={() => setIsManualRouting(false)}
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition ${!isManualRouting ? 'bg-white dark:bg-white/20 shadow-sm text-[#0071e3] dark:text-emerald-400' : 'text-gray-500 hover:text-[#1d1d1f] dark:hover:text-gray-200'}`}
                  >
                    Auto
                  </button>
                  <button 
                    onClick={() => setIsManualRouting(true)}
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition ${isManualRouting ? 'bg-white dark:bg-white/20 shadow-sm text-[#0071e3] dark:text-emerald-400' : 'text-gray-500 hover:text-[#1d1d1f] dark:hover:text-gray-200'}`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* SEARCH LOGIC */}
              {!isManualRouting ? (
                // AUTOMATIC: GPS Origin + Single Destination Search
                <div className="relative mb-5">
                  <input
                    type="text"
                    placeholder="Search city or place..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:outline-none focus:border-[#0071e3] dark:focus:border-emerald-500 transition text-[14px]"
                  />
                  <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🔍
                  </span>
                  <button
                    onClick={async () => {
                      const result = await geocodePlace(searchText);
                      if (!result) return;
                      setMapCenter([result.lat, result.lng]);
                      setNavigationTarget([result.lat, result.lng]);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[12px] font-medium text-[#0071e3] dark:text-emerald-400 hover:text-[#0077ED]"
                  >
                    Go
                  </button>
                </div>
              ) : (
                // MANUAL: Custom Origin + Custom Destination
                <div className="mb-5 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Start location..."
                      value={manualStart}
                      onChange={(e) => setManualStart(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:outline-none focus:border-[#0071e3] dark:focus:border-emerald-500 transition text-[14px]"
                    />
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[12px]">
                      A
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Destination..."
                      value={manualDest}
                      onChange={(e) => setManualDest(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:outline-none focus:border-[#0071e3] dark:focus:border-emerald-500 transition text-[14px]"
                    />
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[12px]">
                      B
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      // Resolve A
                      if (manualStart) {
                        const res1 = await geocodePlace(manualStart);
                        if (res1) setCustomFromLocation([res1.lat, res1.lng]);
                      } else {
                        // fallback to GPS if empty
                        setCustomFromLocation(null); 
                      }

                      // Resolve B
                      if (manualDest) {
                        const res2 = await geocodePlace(manualDest);
                        if (res2) {
                          setMapCenter([res2.lat, res2.lng]);
                          setNavigationTarget([res2.lat, res2.lng]);
                        }
                      }
                    }}
                    className="w-full py-2 bg-[#0071e3] dark:bg-emerald-500 text-white font-medium rounded-xl text-[14px] hover:bg-[#0077ED] dark:hover:bg-emerald-400 shadow-sm transition"
                  >
                    Get Route
                  </button>
                </div>
              )}

              {/* BATTERY */}
              <div>
                <div className="flex justify-between text-[13px] mb-2 font-medium">
                  <span className="text-gray-500 dark:text-gray-400">Current Battery</span>
                  <span className="text-[#0071e3] dark:text-emerald-400">
                    {battery}%
                  </span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={100}
                  value={battery}
                  onChange={(e) => setBattery(Number(e.target.value))}
                  className="w-full accent-[#0071e3] dark:accent-emerald-400"
                />
              </div>
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sortedStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(station);
                    setMapCenter([station.lat, station.lng]);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    station.id === nearestStationId
                      ? "border-[#0071e3]/30 bg-[#0071e3]/5 dark:border-emerald-500/30 dark:bg-emerald-500/10 shadow-sm"
                      : "border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[15px] tracking-tight dark:text-white">
                      {station.name}
                    </h3>
                  </div>

                  <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    {station.distance?.toFixed(1)} km away
                  </p>

                  <div className="flex justify-between items-center mt-3 gap-2">
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 flex-1">
                      <strong className="text-[#0071e3] dark:text-emerald-400 font-semibold">{station.available}</strong> / {station.total} available
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNavigationTarget([station.lat, station.lng]);
                        }}
                        className="px-3 py-1.5 text-[13px] font-semibold bg-white dark:bg-white/10 text-[#0071e3] dark:text-emerald-400 border border-[#0071e3] dark:border-emerald-400 rounded-full hover:bg-gray-50 dark:hover:bg-white/20 transition"
                      >
                        Directions
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/book", { state: { station } });
                        }}
                        className="px-4 py-1.5 text-[13px] font-semibold bg-[#0071e3] dark:bg-emerald-500 text-white rounded-full hover:bg-[#0077ED] dark:hover:bg-emerald-400 transition"
                      >
                        Book
                      </button>
                    </div>
                  </div>

                  {!station.reachable && (
                    <p className="text-[12px] text-red-500 mt-2 font-medium">
                      ⚠ Might not reach with current battery
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}