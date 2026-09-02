import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-cluster";

import { fetchStationsInBoundingBox } from "../services/openChargeMap";
import { normalizeOCMStation } from "../utils/normalizeOCMStation";
import { geocodePlace } from "../services/geocode";
import { minDistanceToPolyline, haversineDistance } from "../utils/geo";
import { greenIcon, yellowIcon, redIcon } from "../components/map/markerIcons";
import { useThemeStore } from "../features/theme/useThemeStore";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../styles/cluster.css";

/* ---------------- CONFIG ---------------- */
const MAX_RANGE_KM = 300;
const MAX_DETOUR_KM = 5; 

function getMarkerIcon(available: number, total: number) {
  if (available === 0) return redIcon;
  if (available / total <= 0.3) return yellowIcon;
  return greenIcon;
}

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function TripPlanner() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const [battery, setBattery] = useState(100);
  const [waypoints, setWaypoints] = useState<string[]>(["", ""]); 
  
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState(0);
  
  const [userPoints, setUserPoints] = useState<[number, number][]>([]);
  const [_allStations, setAllStations] = useState<any[]>([]);
  const [mandatoryStops, setMandatoryStops] = useState<any[]>([]);
  const [suggestedStops, setSuggestedStops] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]);

  const mapTileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const updateWaypoint = (index: number, value: string) => {
    const newWs = [...waypoints];
    newWs[index] = value;
    setWaypoints(newWs);
  };

  const addWaypoint = () => {
    const newWs = [...waypoints];
    newWs.splice(newWs.length - 1, 0, ""); 
    setWaypoints(newWs);
  };

  const removeWaypoint = (index: number) => {
    const newWs = [...waypoints];
    newWs.splice(index, 1);
    setWaypoints(newWs);
  };

  const planJourney = async () => {
    const filledWaypoints = waypoints.filter(w => w.trim() !== "");
    if (filledWaypoints.length < 2) return;
    
    try {
      setLoading(true);
      
      const coordsList: [number, number][] = [];
      for (const wp of filledWaypoints) {
        const res = await geocodePlace(wp);
        if (res) coordsList.push([res.lat, res.lng]);
      }
      
      if (coordsList.length < 2) throw new Error("Could not geocode enough locations.");
      
      setUserPoints(coordsList);
      setMapCenter(coordsList[0]);

      const coordsString = coordsList.map(c => `${c[1]},${c[0]}`).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
      const routeRes = await fetch(url);
      const routeData = await routeRes.json();
      
      let latLngs: [number, number][] = [];
      let totalDist = 0;
      if (routeData.routes && routeData.routes.length > 0) {
        const coords = routeData.routes[0].geometry.coordinates;
        latLngs = coords.map((c: [number, number]) => [c[1], c[0]]);
        setRouteCoords(latLngs);
        totalDist = (routeData.routes[0].distance) / 1000;
        setRouteDistanceKm(totalDist);
      } else {
        throw new Error("No route found.");
      }

      const lats = latLngs.map(c => c[0]);
      const lngs = latLngs.map(c => c[1]);
      const minLat = Math.min(...lats) - 0.1;
      const maxLat = Math.max(...lats) + 0.1;
      const minLng = Math.min(...lngs) - 0.1;
      const maxLng = Math.max(...lngs) + 0.1;

      const raw = await fetchStationsInBoundingBox(minLat, minLng, maxLat, maxLng);
      const normalized = raw.map(normalizeOCMStation);
      
      const sPt = coordsList[0];
      const filtered = normalized.map((s: any) => {
         const distToLine = minDistanceToPolyline(s.lat, s.lng, latLngs);
         const distToStart = haversineDistance(sPt[0], sPt[1], s.lat, s.lng);
         return { ...s, distToLine, distToStart };
      }).filter((s: any) => s.distToLine <= MAX_DETOUR_KM);

      filtered.sort((a: any, b: any) => a.distToStart - b.distToStart);
      setAllStations(filtered);

      let currentRange = (battery / 100) * MAX_RANGE_KM;
      let distanceTravelled = 0;
      const mandatory = [];
      const suggested = [];

      let stationIndex = 0;

      while (distanceTravelled + currentRange < totalDist) {
        const reachableLimit = distanceTravelled + currentRange - 20; 
        
        let bestStation = null;
        for (let i = stationIndex; i < filtered.length; i++) {
          const stObj = filtered[i];
          if (stObj.distToStart <= reachableLimit) {
            bestStation = stObj;
            stationIndex = i + 1;
          } else {
            break; 
          }
        }

        if (bestStation) {
           mandatory.push(bestStation);
           distanceTravelled = bestStation.distToStart; 
           currentRange = MAX_RANGE_KM; 
        } else {
           console.warn("No station found to prevent running out of battery!");
           break;
        }
      }

      for (const st of filtered) {
         if (!mandatory.find(m => m.id === st.id)) {
            suggested.push(st);
         }
      }

      setMandatoryStops(mandatory);
      setSuggestedStops(suggested);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fbfbfd] dark:bg-[#121212] flex items-center justify-center">
      
      {/* ABSOLUTE MAP (Z-0) */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={mapCenter}
          zoom={6}
          className="w-full h-full"
          zoomControl={false}
        >
          <RecenterMap center={mapCenter} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapTileUrl}
          />

          {userPoints.map((pt, i) => (
            <CircleMarker key={i} center={pt} radius={i === 0 ? 8 : i === userPoints.length - 1 ? 8 : 6} pathOptions={{ color: "white", fillColor: i === 0 ? "#1d1d1f" : i === userPoints.length - 1 ? "#0071e3" : "gray", fillOpacity: 1, weight: 2 }} />
          ))}

          {routeCoords && (
            <Polyline positions={routeCoords} pathOptions={{ color: '#0071e3', weight: 6, opacity: 0.8 }} />
          )}

          <MarkerClusterGroup>
            {suggestedStops.map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={getMarkerIcon(s.available, s.total)}>
                <Popup className="rounded-xl font-sans">
                  <div className="p-1 min-w-[150px]">
                    <strong className="block text-[14px] font-semibold text-[#1d1d1f]">{s.name}</strong>
                    <button onClick={() => navigate("/book", { state: { station: s } })} className="mt-2 w-full px-3 py-1 bg-[#0071e3] text-white text-[12px] rounded-full hover:bg-[#0077ED]">Book Slot</button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {mandatoryStops.map((s) => (
              <CircleMarker key={s.id} center={[s.lat, s.lng]} radius={12} pathOptions={{ color: "white", fillColor: "#f97316", fillOpacity: 1, weight: 3 }}>
                <Popup className="rounded-xl font-sans bg-orange-50">
                  <div className="p-1 min-w-[180px]">
                    <span className="text-orange-600 text-[10px] uppercase font-bold tracking-wider block mb-1">Required Stop</span>
                    <strong className="block text-[15px] font-bold text-[#1d1d1f]">{s.name}</strong>
                    <p className="text-[12px] text-gray-700 mt-1">Charge here to complete the next leg safely.</p>
                    <button onClick={() => navigate("/book", { state: { station: s } })} className="mt-3 w-full px-3 py-2 bg-orange-500 text-white text-[12px] font-bold rounded-full hover:bg-orange-600">Reserve Charger</button>
                  </div>
                </Popup>
              </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {loading && (
         <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
           <div className="bg-[#1d1d1f] dark:bg-emerald-500 text-white px-6 py-2 rounded-full font-medium text-[13px] shadow-lg animate-pulse">Processing Route Legs...</div>
         </div>
      )}

      {/* FLOATING LEFT PANEL UI */}
      <div className="absolute top-20 left-4 bottom-8 w-[400px] z-10 pointer-events-none">
        
        <div className="h-full bg-white/75 dark:bg-[#121212]/75 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
          
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mb-1">Trip Planner</h1>
            <p className="text-[13px] text-[#86868b] dark:text-gray-400 font-medium mb-6">Plan multi-stop journeys with smart charging.</p>

            <div className="space-y-3 relative">
              <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              {waypoints.map((wp, index) => (
                <div key={index} className="relative pl-10 flex gap-2">
                  <div className={`absolute left-0 top-1/2 -mt-1.5 w-3 h-3 rounded-full border-[3px] border-white dark:border-[#121212] shadow-sm ${
                      index === 0 ? "bg-[#1d1d1f] dark:bg-gray-100" : index === waypoints.length - 1 ? "bg-[#0071e3] dark:bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"
                  }`}></div>
                  <input
                    type="text"
                    placeholder={index === 0 ? "Start Location" : index === waypoints.length - 1 ? "Destination" : `Stop ${index}`}
                    value={wp}
                    onChange={(e) => updateWaypoint(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-[13px] text-[#1d1d1f] dark:text-white border border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#0071e3] dark:focus:border-emerald-500 transition focus:outline-none"
                  />
                  {index > 0 && index < waypoints.length - 1 && (
                    <button onClick={() => removeWaypoint(index)} className="px-2 text-gray-400 hover:text-red-500 font-bold">×</button>
                  )}
                </div>
              ))}
              
              <button
                 onClick={addWaypoint}
                 className="ml-10 text-[12px] font-semibold text-[#0071e3] dark:text-emerald-400 flex items-center pt-1 hover:underline"
              >
                 + Add Stop
              </button>
              
              <button
                onClick={planJourney}
                disabled={loading}
                className="w-full py-3 bg-[#1d1d1f] dark:bg-emerald-500 text-white rounded-xl font-medium text-[14px] hover:bg-black dark:hover:bg-emerald-400 transition-colors flex items-center justify-center mt-3 shadow-sm"
              >
                {loading ? "Calculating Legs..." : "Generate Nav Route"}
              </button>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[12px] mb-2 font-medium">
                <span className="text-[#86868b] dark:text-gray-400">Starting Battery</span>
                <span className="text-[#0071e3] dark:text-emerald-400">{battery}% ({Math.round((battery/100) * MAX_RANGE_KM)}km)</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={battery}
                onChange={(e) => setBattery(Number(e.target.value))}
                className="w-full accent-[#0071e3] dark:accent-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
             {routeCoords && (
               <div className="bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#86868b] dark:text-gray-400">Distance</p>
                    <p className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">{routeDistanceKm.toFixed(0)} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#86868b] dark:text-gray-400">Stops</p>
                    <p className={`text-lg font-bold tracking-tight ${mandatoryStops.length > 0 ? "text-orange-500" : "text-green-500 dark:text-emerald-400"}`}>
                       {mandatoryStops.length} Req.
                    </p>
                  </div>
               </div>
             )}

             {mandatoryStops.length > 0 && (
               <div>
                 <h3 className="text-[13px] font-bold text-orange-600 dark:text-orange-400 tracking-tight mb-2 flex items-center gap-2 uppercase">
                   Required Charge Stops
                 </h3>
                 <div className="space-y-2">
                   {mandatoryStops.map((station) => (
                     <div key={station.id} className="relative pl-4 pr-3 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-sm border border-orange-200 dark:border-orange-500/20 cursor-pointer" onClick={() => setMapCenter([station.lat, station.lng])}>
                       <h4 className="font-bold text-[13px] text-[#1d1d1f] dark:text-white truncate mb-0.5">{station.name}</h4>
                       <p className="text-[11px] text-orange-700 dark:text-orange-400 font-medium">Battery low ({station.distToStart.toFixed(0)} km from Start)</p>
                       <button
                          onClick={(e) => { e.stopPropagation(); navigate("/book", { state: { station } }) }}
                          className="mt-2 text-[12px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          Book Slot &rsaquo;
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {suggestedStops.length > 0 && mandatoryStops.length === 0 && routeCoords && (
               <p className="text-[12px] text-green-600 dark:text-emerald-400 font-medium bg-green-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg border border-green-100 dark:border-emerald-500/20">
                 You have enough range to complete this trip!
               </p>
             )}
             
             {suggestedStops.length > 0 && (
               <div>
                 <h3 className="text-[13px] font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-2 flex items-center gap-2 uppercase">
                   Other Nearby Stations
                 </h3>
                 <div className="space-y-2">
                   {suggestedStops.map((station) => (
                     <div key={station.id} className="relative px-4 py-3 bg-white/50 dark:bg-white/5 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:border-[#0071e3]/30 dark:hover:border-emerald-500/30 transition cursor-pointer" onClick={() => setMapCenter([station.lat, station.lng])}>
                       <h4 className="font-semibold text-[12px] text-[#1d1d1f] dark:text-white truncate mb-0.5">{station.name}</h4>
                       <p className="text-[11px] text-[#86868b] dark:text-gray-400">{station.distToStart.toFixed(0)} km from Start</p>
                       <button
                            onClick={(e) => { e.stopPropagation(); navigate("/book", { state: { station } }) }}
                            className="mt-1 text-[11px] font-bold text-[#0071e3] dark:text-emerald-400 hover:underline"
                          >
                            Book &rsaquo;
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
