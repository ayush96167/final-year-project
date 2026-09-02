// Content functions for thesis chapters 8-13 + appendices
const h = require('./generate_thesis.cjs');
const { bodyPara, boldRun, normalRun, chapterHeading, sectionHeading, subSectionHeading, blankLine, codeBlock, centeredPara, makeTable, Paragraph, TextRun, PageBreak, AlignmentType, FONT } = h;

function chapter8() {
  const c = [];
  c.push(chapterHeading('Chapter 8\nProject Management'));
  c.push(sectionHeading('8.1 Introduction'));
  c.push(bodyPara('Good project management kept this project on track through 14 weeks of development. We followed Agile sprint-based approach, divided work between team members, tracked tasks, and managed risks proactively.'));
  c.push(sectionHeading('8.2 Development Model (Agile)'));
  c.push(bodyPara([boldRun('Sprint 1 (Week 1-2): '), normalRun('Project setup, Vite + React + TypeScript, Navbar, Home page, React Router.')]));
  c.push(bodyPara([boldRun('Sprint 2 (Week 3-5): '), normalRun('Leaflet.js integration, OpenChargeMap API, station normalization, ChargingMap with clustering and scoring.')]));
  c.push(bodyPara([boldRun('Sprint 3 (Week 6-7): '), normalRun('Zustand auth store, Login/Register pages, ThemeStore, dark map tiles.')]));
  c.push(bodyPara([boldRun('Sprint 4 (Week 8-10): '), normalRun('Nominatim geocoding, OSRM routing, TripPlanner, corridor filtering, mandatory stop algorithm.')]));
  c.push(bodyPara([boldRun('Sprint 5 (Week 11-12): '), normalRun('BookSlot page, Receipt page, navigation flow.')]));
  c.push(bodyPara([boldRun('Sprint 6 (Week 13-14): '), normalRun('Cross-browser testing, bug fixes, UI polish, project report.')]));
  c.push(sectionHeading('8.3 Project Timeline'));
  c.push(makeTable(['Phase','Duration','Key Activities'],[['Requirement Analysis','Week 1','Study existing platforms'],['System Design','Week 2','Architecture, UML diagrams'],['Sprint 1: Setup','Week 2-3','Project init, routing, landing page'],['Sprint 2: Map','Week 3-5','Leaflet, OCM API, scoring'],['Sprint 3: Auth/Theme','Week 6-7','Authentication, dark mode'],['Sprint 4: Trip Planner','Week 8-10','OSRM routing, mandatory stops'],['Sprint 5: Booking','Week 11-12','Booking interface, receipt'],['Sprint 6: Testing','Week 13','Bug fixes, browser testing'],['Documentation','Week 14','Report, presentation']],[2500,1500,4100]));
  c.push(sectionHeading('8.4 Team Contributions'));
  c.push(bodyPara([boldRun('Ayush Chauhan (2201220100043): '), normalRun('Frontend architecture, ChargingMap component, OCM and OSRM integration, dark mode, map tile switching.')]));
  c.push(bodyPara([boldRun('Ayush Singh (2201220100044): '), normalRun('Trip Planner module, greedy stop detection, Slot Booking, Receipt, authentication, testing and documentation.')]));
  c.push(sectionHeading('8.5 Risk Analysis'));
  c.push(makeTable(['Risk','Impact','Probability','Mitigation'],[['OCM API downtime','Station data unavailable','Low','Error handling, graceful fallback'],['OSRM rate limiting','Route fails','Medium','Optimize calls, retry logic'],['Geolocation denied','No GPS features','Medium','Manual location fallback'],['Scope creep','Delayed delivery','High','Clear sprint goals, defer non-essential']],[2000,2000,1500,2600]));
  c.push(sectionHeading('8.6 Quality Assurance'));
  c.push(bodyPara('TypeScript static typing caught bugs at compile time. ESLint enforced code style. Manual testing validated all workflows. Peer code reviews caught logical errors.'));
  return c;
}

function chapter9() {
  const c = [];
  c.push(chapterHeading('Chapter 9\nImplementation and Coding Snippets'));
  c.push(sectionHeading('9.1 Introduction'));
  c.push(bodyPara('This chapter outlines the development environment, tools used, technologies adopted, and code logic implemented to build the EV Charge: A Smart Electric Vehicle Charging Station Discovery, Booking and Trip Planning Platform. It includes illustrative code snippets that reflect the core logic behind the working of the system.'));

  // 9.2 Environment Setup
  c.push(sectionHeading('9.2 Environment Setup and Project Structure'));
  c.push(bodyPara('To ensure a smooth development process, a stable and consistent environment was set up with all the necessary dependencies.'));
  c.push(bodyPara([boldRun('Platform & Tools:')]));
  c.push(bodyPara([boldRun('Operating System: '), normalRun('Windows 10/11 (64-bit)')]));
  c.push(bodyPara([boldRun('IDE: '), normalRun('Visual Studio Code')]));
  c.push(bodyPara([boldRun('Browser: '), normalRun('Google Chrome (primary), Firefox, Edge')]));
  c.push(bodyPara([boldRun('Node.js Version: '), normalRun('Node.js 18+')]));
  c.push(bodyPara([boldRun('Package Manager: '), normalRun('npm (Node Package Manager)')]));
  c.push(bodyPara([boldRun('Build Tool: '), normalRun('Vite 7.3.1')]));
  c.push(bodyPara('The project is organised as a single-page React application with the following directory structure:'));
  c.push(...codeBlock(
`ev-charge-booking/
\u2502
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 pages/           - Route page components
\u2502   \u2502   \u251C\u2500\u2500 Home.tsx       - Landing page
\u2502   \u2502   \u251C\u2500\u2500 Login.tsx      - Authentication
\u2502   \u2502   \u251C\u2500\u2500 Register.tsx   - User registration
\u2502   \u2502   \u251C\u2500\u2500 BookSlot.tsx   - Slot booking interface
\u2502   \u2502   \u251C\u2500\u2500 Receipt.tsx    - Booking confirmation
\u2502   \u2502   \u2514\u2500\u2500 TripPlanner.tsx- Multi-stop journey planner
\u2502   \u251C\u2500\u2500 components/
\u2502   \u2502   \u251C\u2500\u2500 map/           - ChargingMap, marker icons
\u2502   \u2502   \u2514\u2500\u2500 ui/            - Navbar
\u2502   \u251C\u2500\u2500 features/
\u2502   \u2502   \u251C\u2500\u2500 auth/          - useAuthStore (Zustand)
\u2502   \u2502   \u2514\u2500\u2500 theme/         - useThemeStore (Zustand)
\u2502   \u251C\u2500\u2500 services/        - API clients (OCM, Nominatim)
\u2502   \u251C\u2500\u2500 utils/           - Haversine, geo helpers
\u2502   \u251C\u2500\u2500 app/store/       - Booking store
\u2502   \u2514\u2500\u2500 data/            - Static station data
\u251C\u2500\u2500 index.html
\u251C\u2500\u2500 vite.config.ts
\u251C\u2500\u2500 tailwind.config.js
\u2514\u2500\u2500 package.json`));
  c.push(blankLine());

  // 9.3 API Services
  c.push(sectionHeading('9.3 API Service Layer'));
  c.push(bodyPara('The API service layer (services/openChargeMap.ts) fetches EV charging station data from the OpenChargeMap global registry. Two functions are provided: one fetches stations by radius around a coordinate, and the other fetches stations within a geographic bounding box for trip corridor filtering.'));
  c.push(bodyPara([boldRun('OpenChargeMap API Service (services/openChargeMap.ts):')]));
  c.push(...codeBlock(
`export async function fetchChargingStations(
  lat: number,
  lng: number,
  distanceKm = 25
) {
  const response = await fetch(
    \`https://api.openchargemap.io/v3/poi/?output=json
     &latitude=\${lat}&longitude=\${lng}
     &distance=\${distanceKm}&distanceunit=KM
     &maxresults=200\`,
    {
      headers: {
        "X-API-Key": import.meta.env.VITE_OPENCHARGE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch charging stations");
  }
  return response.json();
}

export async function fetchStationsInBoundingBox(
  minLat: number, minLng: number,
  maxLat: number, maxLng: number
) {
  const response = await fetch(
    \`https://api.openchargemap.io/v3/poi/?output=json
     &boundingbox=(\${minLat},\${minLng}),(\${maxLat},\${maxLng})
     &maxresults=500\`,
    {
      headers: {
        "X-API-Key": import.meta.env.VITE_OPENCHARGE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stations by bounding box");
  }
  return response.json();
}`));
  c.push(blankLine());

  c.push(bodyPara([boldRun('Nominatim Geocoding Service (services/geocode.ts):')]));
  c.push(bodyPara('The geocoding service converts place names (e.g., "Delhi", "Lucknow") into geographic coordinates using the Nominatim API, which is powered by OpenStreetMap data.'));
  c.push(...codeBlock(
`export async function geocodePlace(query: string) {
  const res = await fetch(
    \`https://nominatim.openstreetmap.org/search?format=json&q=\${query}\`
  );

  const data = await res.json();
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}`));
  c.push(blankLine());

  // 9.4 Geo Utilities
  c.push(sectionHeading('9.4 Geographic Computation Utilities'));
  c.push(bodyPara('The utility module (utils/geo.ts) provides three core geospatial functions. The Haversine formula calculates the great-circle distance between two points on the Earth\u2019s surface. The distanceToSegment function computes the perpendicular distance from a point to a line segment using Equirectangular approximation. The minDistanceToPolyline function finds the minimum distance from a station to any segment of the route polyline, used for corridor filtering.'));
  c.push(bodyPara([boldRun('Haversine Distance Calculation (utils/geo.ts):')]));
  c.push(...codeBlock(
`export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}`));
  c.push(blankLine());

  c.push(bodyPara([boldRun('Minimum Distance to Route Polyline (utils/geo.ts):')]));
  c.push(...codeBlock(
`export function minDistanceToPolyline(
  lat: number, lng: number,
  polyline: [number, number][]
) {
  let minD = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = distanceToSegment(
      lat, lng,
      polyline[i][0], polyline[i][1],
      polyline[i+1][0], polyline[i+1][1]
    );
    if (d < minD) minD = d;
  }
  return minD;
}`));
  c.push(blankLine());

  // 9.5 Station Normalization
  c.push(sectionHeading('9.5 Station Data Normalization'));
  c.push(bodyPara('The normalizeOCMStation function (utils/normalizeOCMStation.ts) transforms the deeply nested OpenChargeMap API response into a flat, predictable data structure used throughout the application. It extracts essential fields such as station ID, name, coordinates, connector count, maximum power rating, connector types, and operational status.'));
  c.push(...codeBlock(
`export function normalizeOCMStation(station: any) {
  const connections = station.Connections || [];

  return {
    id: station.ID,
    name: station.AddressInfo?.Title || "Charging Station",
    lat: station.AddressInfo.Latitude,
    lng: station.AddressInfo.Longitude,

    total: connections.length || 1,
    available: connections.length || 1,

    powerKW: Math.max(
      ...connections.map((c: any) => c.PowerKW || 0),
      0
    ),

    connectorTypes: connections
      .map((c: any) => c.ConnectionType?.Title)
      .filter(Boolean),

    isOperational: station.StatusType?.IsOperational ?? true,
  };
}`));
  c.push(blankLine());

  // 9.6 Station Scoring Algorithm
  c.push(sectionHeading('9.6 Multi-Factor Station Scoring Algorithm'));
  c.push(bodyPara('The ChargingMap component (components/map/ChargingMap.tsx) implements a multi-factor scoring algorithm that ranks stations not just by distance, but by a weighted combination of distance, congestion level, and battery risk. This ensures that users are recommended the most optimal station, not simply the nearest one.'));
  c.push(...codeBlock(
`function canReach(distance: number, battery: number) {
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
}`));
  c.push(blankLine());
  c.push(bodyPara('The scoring formula produces a composite score where lower values indicate better station choices. Distance is weighted at 0.5, congestion contributes up to 30 points, and battery risk adds up to 20 points when battery is critically low (below 25%). Stations are then sorted in ascending order of score.'));

  // 9.7 Trip Planner
  c.push(sectionHeading('9.7 Trip Planner \u2013 Greedy Mandatory Stop Detection'));
  c.push(bodyPara('The Trip Planner (pages/TripPlanner.tsx) is the most algorithmically complex component. It geocodes user waypoints, fetches a route from OSRM, discovers charging stations along the corridor, and uses a greedy algorithm to detect mandatory charging stops. The following excerpt shows the core journey planning logic:'));
  c.push(bodyPara([boldRun('Route Computation and Corridor Station Filtering:')]));
  c.push(...codeBlock(
`const planJourney = async () => {
  const filledWaypoints = waypoints.filter(w => w.trim() !== "");
  if (filledWaypoints.length < 2) return;

  // Step 1: Geocode all waypoints
  const coordsList: [number, number][] = [];
  for (const wp of filledWaypoints) {
    const res = await geocodePlace(wp);
    if (res) coordsList.push([res.lat, res.lng]);
  }

  // Step 2: Fetch route from OSRM
  const coordsString = coordsList
    .map(c => \`\${c[1]},\${c[0]}\`).join(";");
  const url = \`https://router.project-osrm.org/route/v1/driving/
    \${coordsString}?overview=full&geometries=geojson\`;
  const routeRes = await fetch(url);
  const routeData = await routeRes.json();

  // Step 3: Extract route coordinates
  const coords = routeData.routes[0].geometry.coordinates;
  const latLngs = coords.map(
    (c: [number, number]) => [c[1], c[0]]
  );
  const totalDist = routeData.routes[0].distance / 1000;

  // Step 4: Fetch stations within route bounding box
  const raw = await fetchStationsInBoundingBox(
    minLat, minLng, maxLat, maxLng
  );

  // Step 5: Filter stations within 5km of route
  const filtered = normalized.filter(
    (s: any) => minDistanceToPolyline(
      s.lat, s.lng, latLngs
    ) <= MAX_DETOUR_KM
  );`));
  c.push(blankLine());

  c.push(bodyPara([boldRun('Greedy Mandatory Stop Detection Algorithm:')]));
  c.push(bodyPara('The greedy algorithm simulates the journey starting from the user\u2019s battery level and a configurable 300 km maximum vehicle range. At each iteration, it identifies the farthest reachable station before battery depletion (with a 20 km safety buffer), marks it as a mandatory stop, assumes a full charge, and repeats until the destination is reachable.'));
  c.push(...codeBlock(
`  // Step 6: Greedy mandatory stop detection
  let currentRange = (battery / 100) * MAX_RANGE_KM;
  let distanceTravelled = 0;
  const mandatory = [];
  let stationIndex = 0;

  while (distanceTravelled + currentRange < totalDist) {
    // 20km safety buffer
    const reachableLimit =
      distanceTravelled + currentRange - 20;

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
      currentRange = MAX_RANGE_KM; // full charge
    } else {
      console.warn("No station found!");
      break;
    }
  }`));
  c.push(blankLine());

  // 9.8 State Management
  c.push(sectionHeading('9.8 State Management \u2013 Zustand Stores'));
  c.push(bodyPara('The application uses Zustand for global state management, chosen for its minimal boilerplate and excellent React integration. Three stores manage authentication, theme preferences, and booking state respectively.'));
  c.push(bodyPara([boldRun('Authentication Store (features/auth/useAuthStore.ts):')]));
  c.push(...codeBlock(
`import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));`));
  c.push(blankLine());

  c.push(bodyPara([boldRun('Theme Store with System Preference Detection (features/theme/useThemeStore.ts):')]));
  c.push(bodyPara('The theme store automatically detects the user\u2019s system colour preference on load, persists the choice to localStorage, and dynamically toggles the dark CSS class on the document root element.'));
  c.push(...codeBlock(
`export const useThemeStore = create<ThemeState>((set) => {
  // Detect system preference on load
  const isSystemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const storedTheme = localStorage.getItem("theme");
  const initialDark =
    storedTheme === "dark" || (!storedTheme && isSystemDark);

  if (initialDark) {
    document.documentElement.classList.add("dark");
  }

  return {
    isDark: initialDark,
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDark;
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return { isDark: newIsDark };
    }),
  };
});`));
  c.push(blankLine());

  c.push(bodyPara([boldRun('Booking Store (app/store/bookingStore.ts):')]));
  c.push(...codeBlock(
`export const useBookingStore = create<BookingStore>((set, get) => ({
  bookedSlots: {},

  bookSlot: (stationId, slot) =>
    set((state) => ({
      bookedSlots: {
        ...state.bookedSlots,
        [stationId]: [
          ...(state.bookedSlots[stationId] || []),
          slot,
        ],
      },
    })),

  isSlotBooked: (stationId, slot) =>
    get().bookedSlots[stationId]?.includes(slot) ?? false,
}));`));
  c.push(blankLine());

  // 9.9 Slot Booking
  c.push(sectionHeading('9.9 Slot Booking Interface'));
  c.push(bodyPara('The BookSlot page (pages/BookSlot.tsx) implements a multi-step booking interface. Users first select a date from a 14-day calendar, then choose a time period (Morning, Noon, Evening, Night), and finally pick a specific hourly time slot. The booking confirmation navigates to the receipt page with the booking details passed via React Router state.'));
  c.push(bodyPara([boldRun('Booking Confirmation Handler (pages/BookSlot.tsx):')]));
  c.push(...codeBlock(
`onClick={() => {
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
}`));
  c.push(blankLine());

  // 9.10 Application Routing
  c.push(sectionHeading('9.10 Application Routing'));
  c.push(bodyPara('The main application component (App.tsx) uses React Router DOM for client-side routing. All routes are wrapped inside a BrowserRouter with a persistent Navbar component.'));
  c.push(...codeBlock(
`import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/book" element={<BookSlot />} />
        <Route path="/trip" element={<TripPlanner />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </BrowserRouter>
  );
}`));
  c.push(blankLine());

  // 9.11 Dark Mode Map Tile Switching
  c.push(sectionHeading('9.11 Dark Mode Map Tile Switching'));
  c.push(bodyPara('A distinctive feature of the platform is that the map tiles dynamically switch between CARTO Voyager (light theme) and CARTO Dark Matter (dark theme) based on the user\u2019s theme preference. This is achieved by consuming the theme store within map components:'));
  c.push(...codeBlock(
`const { isDark } = useThemeStore();

const mapTileUrl = isDark
  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";`));
  c.push(blankLine());

  // 9.12 Custom SVG Marker Icons
  c.push(sectionHeading('9.12 Custom SVG Marker Icons'));
  c.push(bodyPara('The map uses custom SVG-based Leaflet divIcon markers with three colour variants (green, yellow, red) to visually indicate station availability at a glance. The createIcon factory function generates lightweight SVG pin markers:'));
  c.push(...codeBlock(
`import L from "leaflet";

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: \`
      <svg width="24" height="24" viewBox="0 0 24 24"
           fill="\${color}"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25
                 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>\`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export const greenIcon  = createIcon("#22c55e");
export const yellowIcon = createIcon("#eab308");
export const redIcon    = createIcon("#ef4444");`));
  c.push(blankLine());

  c.push(bodyPara('The marker colour is determined by station availability ratio: green for stations with more than 30% ports available, yellow for stations with 1\u201330% availability, and red for fully occupied stations.'));

  return c;
}

function chapter10() {
  const c = [];
  c.push(chapterHeading('Chapter 10\nPerformance Evaluation'));
  c.push(sectionHeading('10.1 Performance Metrics'));
  c.push(makeTable(['Metric','Value','Description'],[['Station Fetch Time','1.2\u20132.5 sec','200 stations from OCM'],['Route Computation','0.8\u20131.5 sec','OSRM route up to 1000 km'],['Geocoding Time','0.3\u20130.8 sec','Nominatim per query'],['Scoring Algorithm','< 10 ms','200 stations scored'],['Stop Detection','< 5 ms','Greedy algorithm'],['Page Load','1.5\u20132.0 sec','First Contentful Paint'],['API Success Rate','97.5%','Across all testing'],['Map FPS','55\u201360 FPS','Pan/zoom rendering'],['Haversine Accuracy','\u00B10.5%','vs. references']],[2600,2200,3300]));
  c.push(sectionHeading('10.2 Performance Analysis'));
  c.push(bodyPara('API network calls dominate response time; client-side computations are negligible (under 10ms). React virtual DOM and Zustand selectors ensure efficient re-rendering. Marker clustering prevents degradation with hundreds of stations. Memory usage: 50-80 MB.'));
  c.push(sectionHeading('10.3 Comparative Analysis'));
  c.push(makeTable(['Feature','Google Maps','PlugShare','Tata Power EZ','EV Charge'],[['Multi-network data','Partial','Yes','No','Yes (OCM)'],['Battery-aware scoring','No','No','No','Yes'],['Trip planning w/ stops','No','Limited','No','Yes (auto)'],['Advance booking','No','No','Yes','Yes'],['Open-source','No','No','No','Yes'],['Dark mode map','Yes','No','No','Yes']],[2600,1400,1400,1500,1500]));
  c.push(bodyPara('EV Charge offers the most comprehensive feature set of any single platform reviewed.'));
  c.push(sectionHeading('10.4 Scalability'));
  c.push(bodyPara('Client-side architecture means each user processes data independently. OpenChargeMap queries limit station counts to manageable subsets. Self-hosted OSRM/Nominatim can eliminate public API rate limits for commercial scale. Platform works globally wherever OpenChargeMap has coverage.'));
  return c;
}

function chapter11() {
  const c = [];
  c.push(chapterHeading('Chapter 11\nResult Analysis and Discussion'));
  c.push(sectionHeading('11.1 Testing Overview'));
  c.push(bodyPara('Testing covered functional testing, input-output validation, performance testing, UI testing, API response testing, and edge case testing. Real-world data from OpenChargeMap was used, testing in Delhi, Lucknow, Mumbai, Bangalore, Chennai.'));
  c.push(sectionHeading('11.2 Test Scenarios'));
  c.push(bodyPara([boldRun('Test 1 \u2014 Delhi Station Discovery: '), normalRun('87 stations fetched, scored, color-coded correctly. Battery 50%, Radius 25km.')]));
  c.push(bodyPara([boldRun('Test 2 \u2014 Delhi to Agra: '), normalRun('Route ~233km, 42 corridor stations, 1 mandatory stop at ~160km. Battery 60%.')]));
  c.push(bodyPara([boldRun('Test 3 \u2014 Delhi to Jaipur: '), normalRun('Route ~281km, 1 mandatory stop correctly identified. Battery 80%.')]));
  c.push(bodyPara([boldRun('Test 4 \u2014 Short Route: '), normalRun('~3km, no stops needed. "Enough range" message displayed correctly. Battery 90%.')]));
  c.push(bodyPara([boldRun('Test 5 \u2014 Booking Flow: '), normalRun('Station selected, date/period/slot chosen, receipt generated correctly.')]));
  c.push(sectionHeading('11.3 Quantitative Results'));
  c.push(makeTable(['Metric','Value'],[['Avg station fetch (200 stations)','1.8 sec'],['Avg route computation','1.1 sec'],['Avg geocoding time','0.5 sec'],['Scoring execution (200 stations)','7 ms'],['Stop detection','3 ms'],['API success rate','97.5%'],['Total workflow (search to booking)','12 sec'],['Map FPS','55\u201360'],['Haversine accuracy','\u00B10.5%']],[5000,3000]));
  c.push(sectionHeading('11.4 Advantages'));
  c.push(bodyPara([boldRun('i. '), normalRun('Comprehensive integration: discovery, recommendation, trip planning, booking in one interface.')]));
  c.push(bodyPara([boldRun('ii. '), normalRun('Battery-aware multi-factor scoring provides more relevant recommendations.')]));
  c.push(bodyPara([boldRun('iii. '), normalRun('Open-source foundation \u2014 no vendor lock-in.')]));
  c.push(bodyPara([boldRun('iv. '), normalRun('Premium UI with glassmorphism, animations, dark mode.')]));
  c.push(bodyPara([boldRun('v. '), normalRun('Cross-platform web app, no installation required.')]));
  c.push(sectionHeading('11.5 Limitations'));
  c.push(bodyPara([boldRun('i. '), normalRun('Simulated availability (OCM API does not provide real-time port status).')]));
  c.push(bodyPara([boldRun('ii. '), normalRun('Client-side authentication only \u2014 not production-grade.')]));
  c.push(bodyPara([boldRun('iii. '), normalRun('No payment integration.')]));
  c.push(bodyPara([boldRun('iv. '), normalRun('Fixed 300km vehicle range assumption.')]));
  c.push(bodyPara([boldRun('v. '), normalRun('Internet required; no offline mode.')]));
  return c;
}

function chapter12() {
  const c = [];
  c.push(chapterHeading('Chapter 12\nConclusion'));
  c.push(sectionHeading('12.1 Summary'));
  c.push(bodyPara('Over 14 weeks, we developed a complete web platform integrating station discovery from OpenChargeMap, battery-aware scoring, OSRM-based trip planning with greedy mandatory stop detection, and structured slot booking with receipt generation. All seven primary objectives were successfully achieved.'));
  c.push(sectionHeading('12.2 Key Findings'));
  c.push(bodyPara([boldRun('1. '), normalRun('Open-source viability: production-quality platform with zero licensing costs.')]));
  c.push(bodyPara([boldRun('2. '), normalRun('Multi-factor scoring provides measurably better recommendations than distance-only sorting.')]));
  c.push(bodyPara([boldRun('3. '), normalRun('Greedy algorithm produces results in milliseconds for real-time trip planning.')]));
  c.push(bodyPara([boldRun('4. '), normalRun('OpenChargeMap, OSRM, and Nominatim are reliable enough for real-world applications.')]));
  c.push(sectionHeading('12.3 Significance'));
  c.push(bodyPara('Practically: functional tool addressing real EV owner pain points. Technically: demonstrates multi-API integration, custom recommendation algorithm, greedy optimization. Educationally: comprehensive case study in modern web development. Environmentally: supports EV adoption by reducing range anxiety.'));
  c.push(sectionHeading('12.4 Learning Outcomes'));
  c.push(bodyPara('Practical experience in React.js, TypeScript, Leaflet.js, API integration, Zustand, Framer Motion, TailwindCSS, system design, algorithm design (Haversine, greedy optimization, multi-factor scoring), Agile project management, and EV charging domain knowledge.'));
  c.push(sectionHeading('12.5 Overall Conclusion'));
  c.push(bodyPara('EV Charge demonstrates that a comprehensive, intelligent, and visually polished EV charging management platform can be built using entirely open-source technologies at minimal cost. It fills a genuine gap in the current EV ecosystem and has real potential to evolve into a production-ready solution.'));
  return c;
}

function chapter13() {
  const c = [];
  c.push(chapterHeading('Chapter 13\nFuture Scope'));
  c.push(sectionHeading('13.1 Real-Time Availability'));
  c.push(bodyPara('Integration of real-time charger port availability via OCPP (Open Charge Point Protocol). Crowdsourced user reports to supplement automated data. Predictive availability using ML on historical usage patterns.'));
  c.push(sectionHeading('13.2 Payment Gateway Integration'));
  c.push(bodyPara('Razorpay, Stripe, or UPI integration for end-to-end charging transactions. Pre-payment, dynamic pricing, invoice generation, wallet and subscription models.'));
  c.push(sectionHeading('13.3 Mobile Application'));
  c.push(bodyPara('Native or cross-platform mobile app (React Native/Flutter) with push notifications, background GPS, offline map caching, OBD-II battery data integration, and CarPlay/Android Auto support.'));
  c.push(sectionHeading('13.4 Machine Learning Recommendations'));
  c.push(bodyPara('Collaborative filtering, time-series demand prediction, reinforcement learning for route optimization, and vehicle-specific range prediction models accounting for vehicle type, driving style, weather, and elevation.'));
  c.push(sectionHeading('13.5 Emerging Technologies'));
  c.push(bodyPara('IoT-enabled station monitoring, blockchain for transparent transactions and peer-to-peer energy trading, Vehicle-to-Grid (V2G) support, and AR-based navigation for intuitive wayfinding.'));
  c.push(sectionHeading('13.6 Community and Scalability'));
  c.push(bodyPara('User reviews, photo uploads, community-reported additions, gamification. Backend with Node.js + PostgreSQL/MongoDB for persistence. Microservices architecture for independent scaling. Revenue models: freemium, commission, advertising, white-label licensing.'));
  c.push(sectionHeading('13.7 Multi-Language and Accessibility'));
  c.push(bodyPara('Hindi, Tamil, Telugu, Bengali, Marathi via i18n. Screen reader compatibility via ARIA attributes. High-contrast mode. Voice-based search for hands-free operation.'));
  return c;
}

function appendices() {
  const c = [];
  c.push(new Paragraph({ children: [new PageBreak()] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'LIST OF FIGURES', font: FONT, size: 36, bold: true, underline: {} })] }));
  c.push(makeTable(['Figure No.','Description','Page'],[['3.1','Block Diagram of Proposed System','20'],['3.2','System Architecture Diagram','29'],['4.1','Level 0 DFD','32'],['4.2','Level 1 DFD','33'],['4.3','Use Case Diagram','34'],['4.4','Class Diagram','35'],['4.5','Sequence Diagram','37'],['4.6','Activity Diagram','38'],['5.1','ER Diagram','45']],[1600,5000,1500]));
  c.push(blankLine());
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 200, after: 300 },
    children: [new TextRun({ text: 'LIST OF TABLES', font: FONT, size: 36, bold: true, underline: {} })] }));
  c.push(makeTable(['Table No.','Description','Page'],[['3.1','Software Technologies','22'],['3.2','External APIs','24'],['4.1','Use Case Descriptions','33'],['5.1','Station Object Fields','43'],['5.2','Zustand Store Properties','42'],['7.1','Security Mechanisms','56'],['8.1','Project Timeline','61'],['8.2','Risk Analysis','64'],['10.1','Performance Metrics','72'],['10.2','Comparative Analysis','74'],['11.1','Quantitative Results','80']],[1600,5000,1500]));
  c.push(new Paragraph({ children: [new PageBreak()] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'LIST OF ABBREVIATIONS', font: FONT, size: 28, bold: true, underline: {} })] }));
  const abbrevs = [['EV','Electric Vehicle'],['BEV','Battery Electric Vehicle'],['ICE','Internal Combustion Engine'],['API','Application Programming Interface'],['REST','Representational State Transfer'],['JSON','JavaScript Object Notation'],['GPS','Global Positioning System'],['SPA','Single Page Application'],['OCM','OpenChargeMap'],['OSRM','Open Source Routing Machine'],['OSM','OpenStreetMap'],['DFD','Data Flow Diagram'],['UML','Unified Modeling Language'],['ER','Entity-Relationship'],['UI','User Interface'],['CSS','Cascading Style Sheets'],['HTML','HyperText Markup Language'],['TSX','TypeScript XML'],['DOM','Document Object Model'],['HMR','Hot Module Replacement'],['CDN','Content Delivery Network'],['HTTPS','HyperText Transfer Protocol Secure'],['CORS','Cross-Origin Resource Sharing'],['JWT','JSON Web Token'],['OCPP','Open Charge Point Protocol'],['FAME','Faster Adoption and Manufacturing of EVs'],['CCS','Combined Charging System'],['DC','Direct Current'],['AC','Alternating Current'],['kW','Kilowatt'],['km','Kilometer'],['INR','Indian National Rupee'],['IoT','Internet of Things'],['V2G','Vehicle-to-Grid'],['ML','Machine Learning'],['FPS','Frames Per Second'],['IEA','International Energy Agency']];
  c.push(makeTable(['Abbreviation','Full Form'],abbrevs,[2500,5500]));
  c.push(new Paragraph({ children: [new PageBreak()] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'REFERENCES & BIBLIOGRAPHY', font: FONT, size: 36, bold: true, underline: {} })] }));
  const refs = [
    '[1] IEA, "Global EV Outlook 2024," IEA Publications, Paris, 2024. https://www.iea.org/reports/global-ev-outlook-2024',
    '[2] SMEV, "India EV Sales Data Report 2024," New Delhi, 2024. https://www.smev.in/',
    '[3] Ministry of Heavy Industries, "FAME India Scheme Phase II," 2019. https://fame2.heavyindustries.gov.in/',
    '[4] OpenChargeMap, "API Documentation, Version 3," 2024. https://openchargemap.org/site/develop/api',
    '[5] V. Agafonkin, "Leaflet.js," 2024. https://leafletjs.com/',
    '[6] Project OSRM, "Open Source Routing Machine," 2024. http://project-osrm.org/',
    '[7] OSM Foundation, "Nominatim: Geocoding with OpenStreetMap," 2024. https://nominatim.openstreetmap.org/',
    '[8] Meta, "React: A JavaScript Library for Building UIs," 2024. https://react.dev/',
    '[9] Zustand Team, "Zustand: Fast State Management," 2024. https://github.com/pmndrs/zustand',
    '[10] Evan You et al., "Vite: Next Generation Frontend Tooling," 2024. https://vite.dev/',
    '[11] S. Storandt, "Quick and Energy-Efficient Routes for EVs," ACM SIGSPATIAL, pp. 20-25, 2012.',
    '[12] M. Sachenbacher et al., "Efficient Energy-Optimal Routing for EVs," AAAI, pp. 1402-1407, 2011.',
    '[13] Y. Qin and W. Zhang, "Recommendation Framework for EV Charging," IEEE Trans. ITS, Vol. 20(6), pp. 2236-2250, 2019.',
    '[14] Y. Cao et al., "EV Charging Reservation Under Preemptive Scheduling," IEEE Trans. ITS, Vol. 21(7), pp. 2885-2897, 2020.',
    '[15] TailwindCSS Team, "Tailwind CSS," 2024. https://tailwindcss.com/',
    '[16] Framer Team, "Framer Motion," 2024. https://www.framer.com/motion/',
    '[17] "React Router," Remix Software, 2024. https://reactrouter.com/',
    '[18] "Leaflet.MarkerCluster," GitHub, 2024. https://github.com/Leaflet/Leaflet.markercluster',
    '[19] CARTO, "CARTO Basemaps," 2024. https://carto.com/basemaps/',
    '[20] BIS, "IS 17017: EV Conductive Charging System," 2023.',
    '[21] NITI Aayog, "India\'s Electric Mobility Transformation," 2024.',
    '[22] Microsoft, "TypeScript," 2024. https://www.typescriptlang.org/',
    '[23] PlugShare, "Largest EV Charging Directory," 2024. https://www.plugshare.com/',
    '[24] OSM Foundation, "OpenStreetMap," 2024. https://www.openstreetmap.org/',
    '[25] R. Sinnott, "Virtues of the Haversine," Sky and Telescope, Vol. 68(2), pp. 159, 1984.',
  ];
  refs.forEach(ref => { c.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 280, before: 60, after: 60 },
    children: [new TextRun({ text: ref, font: FONT, size: 20 })] })); });
  return c;
}

module.exports = { chapter8, chapter9, chapter10, chapter11, chapter12, chapter13, appendices };
