// Content functions for thesis chapters 1-7
const h = require('./generate_thesis.cjs');
const { bodyPara, boldRun, normalRun, chapterHeading, sectionHeading, subSectionHeading, blankLine, centeredPara, makeTable, Paragraph, TextRun, PageBreak, AlignmentType, FONT } = h;

function chapter1() {
  const c = [];
  c.push(chapterHeading('Chapter 1\nIntroduction'));
  c.push(sectionHeading('1.1 Background'));
  c.push(bodyPara('The global automobile industry is going through one of the biggest transformations in its history. The shift from petrol and diesel vehicles to battery electric vehicles is being driven by a combination of environmental concerns, supportive government policies, rapidly improving battery technology, and a changing attitude among consumers toward cleaner modes of transport. According to the International Energy Agency (IEA), global electric car sales crossed 14 million units in 2023, which is roughly a 35 percent jump from the previous year. And this growth has not slowed down since then.'));
  c.push(bodyPara('In India, the EV market has been growing at a particularly fast rate, pushed along by government schemes like FAME-II (Faster Adoption and Manufacturing of Electric Vehicles), the National Electric Mobility Mission Plan, and various state-level incentives such as purchase subsidies, waived registration fees, and lower road tax. India crossed 1.5 million electric vehicle sales in 2024, with two-wheelers making up the largest segment, followed by three-wheelers and four-wheelers. Several states have announced plans to convert entire public transport fleets to electric.'));
  c.push(bodyPara('But this rapid growth has also exposed a serious problem: the charging infrastructure is nowhere near ready. Unlike petrol stations that are well distributed and easy to find, EV charging stations are sparse, unevenly spread, and exist across multiple disconnected platforms. If you own an EV and want to plan a long-distance trip, you typically have to check three or four different apps, none of which talk to each other, and hope the station you find is actually working when you get there.'));
  c.push(bodyPara('This "range anxiety" \u2014 the fear of running out of battery before reaching a charger \u2014 is one of the most cited reasons people hesitate to switch to electric vehicles. And it is not entirely irrational. The diversity of charging standards adds another layer of confusion: Level 1 chargers (standard outlets) are painfully slow, Level 2 chargers (7-22 kW) are suitable for overnight charging, and Level 3 DC fast chargers (50-350 kW) can charge in under an hour but are far less common.'));
  c.push(bodyPara('Existing solutions for finding EV chargers are either tied to specific charging networks (showing only their own stations) or are generic map apps like Google Maps that list stations but offer no booking, no battery-aware recommendations, and no trip planning for EVs. This fragmentation is the exact problem that "EV Charge" is designed to address.'));
  c.push(bodyPara('EV Charge is a web-based platform that brings together station discovery from the OpenChargeMap global registry, battery-aware station scoring, multi-stop trip planning with automatic charging stop detection, and time-slot booking \u2014 all in a single interface. The entire platform is built on open-source technologies, meaning no proprietary dependencies and no vendor lock-in.'));
  c.push(sectionHeading('1.2 Identification of Need'));
  c.push(bodyPara('Before starting development, we spent time understanding exactly what problems EV owners face in India today. A few pain points kept coming up repeatedly.'));
  c.push(bodyPara([boldRun('Fragmented Charging Data. '), normalRun('Station information is scattered across multiple proprietary apps, each showing only their own network. A user has to install several different applications just to get a complete picture of what\'s available nearby. This is inconvenient at best and genuinely dangerous when your battery is running low.')]));
  c.push(bodyPara([boldRun('No Battery-Aware Recommendations. '), normalRun('Most apps that list EV stations sort them by distance alone, without considering the user\'s current battery level, station congestion, or whether the station is even reachable.')]));
  c.push(bodyPara([boldRun('No Trip Planning with Charging Integration. '), normalRun('Long-distance EV travel requires careful planning. Unlike ICE vehicles that can be refueled quickly at any fuel station, EVs need strategically placed charging stops. Most navigation apps simply don\'t support this.')]));
  c.push(bodyPara([boldRun('No Advance Booking System. '), normalRun('At busy charging locations, especially during holidays, users often arrive only to find all ports occupied. There is no way to reserve a slot in advance on most platforms.')]));
  c.push(bodyPara([boldRun('Vendor Lock-In. '), normalRun('Proprietary apps promote only their own charging networks. This limits user choice and creates an unfair playing field where market dominance, rather than actual service quality, determines visibility.')]));
  c.push(bodyPara('EV Charge was designed to tackle all of these problems: vendor-neutral data from OpenChargeMap, a scoring algorithm that actually considers battery level, trip planning with automatic stop detection, and a structured slot booking interface.'));
  c.push(sectionHeading('1.3 Preliminary Investigation'));
  c.push(bodyPara('Before writing a single line of code, we investigated what currently exists and what technologies we could realistically build on. We looked at existing EV apps in the Indian market: Tata Power EZ Charge, EESL Connect, Fortum Charge & Drive, and Statiq. All of them work as isolated ecosystems.'));
  c.push(bodyPara('We then looked at open data sources. OpenChargeMap (OCM) turned out to be exactly what we needed: over 300,000 charging locations across 65 countries, with a well-documented REST API. For mapping, Leaflet.js was an obvious choice. For routing, OSRM provides high-performance route computation using OpenStreetMap data. Nominatim handles geocoding.'));
  c.push(bodyPara('For the frontend framework, React.js with TypeScript was the clear choice. Zustand was picked for state management due to its minimal boilerplate, and Vite for the build tool because of its noticeably faster development experience. This investigation confirmed that building the proposed platform was both technically achievable and practically worthwhile.'));
  c.push(sectionHeading('1.4 Feasibility Study'));
  c.push(subSectionHeading('1.4.1 Technical Feasibility'));
  c.push(bodyPara('All the technologies we planned to use are mature, well-documented, and widely used in production applications. React.js v19, TypeScript, Vite, Leaflet.js, Zustand, and TailwindCSS are all actively maintained with large communities. The external APIs (OpenChargeMap, OSRM, Nominatim) are stable RESTful services with JSON responses. The project is technically feasible.'));
  c.push(subSectionHeading('1.4.2 Economic Feasibility'));
  c.push(bodyPara('The entire project uses open-source, zero-cost technologies. The OpenChargeMap API is free for educational use. OSRM and Nominatim have freely accessible public instances. The direct financial cost is essentially zero in terms of software licensing. The project is clearly economically feasible.'));
  c.push(subSectionHeading('1.4.3 Operational Feasibility'));
  c.push(bodyPara('EV Charge is a web application that runs in any modern browser \u2014 no installation required. The interface is designed to be intuitive with clear navigation, visual color-coding on the map, and a linear booking flow. Both light and dark modes are supported. The operational feasibility is confirmed.'));
  return c;
}

function chapter2() {
  const c = [];
  c.push(chapterHeading('Chapter 2\nLiterature Survey'));
  c.push(sectionHeading('2.1 Introduction'));
  c.push(bodyPara('Before designing any new system, it is important to understand what has already been done in the field. This chapter reviews existing literature related to EV charging infrastructure, geospatial technologies, routing algorithms, recommendation systems, and booking platforms.'));
  c.push(sectionHeading('2.2 Historical Development of EV Charging Infrastructure'));
  c.push(bodyPara('Electric vehicles are not a new concept \u2014 the first practical EVs appeared in the late 19th century, but they were overshadowed by the internal combustion engine for most of the 20th century. The modern EV revival began in earnest in the 2000s, driven by advances in lithium-ion battery technology and growing concerns about urban air quality and climate change.'));
  c.push(bodyPara('Early charging infrastructure was limited to slow AC charging. The introduction of standardized connector types (CCS, CHAdeMO, Type 2) and DC fast charging significantly improved charging speeds. In India, FAME-I launched in 2015 began creating a structured EV ecosystem, followed by FAME-II in 2019 which allocated substantial funds for charging infrastructure deployment.'));
  c.push(sectionHeading('2.3 Existing EV Charging Platforms'));
  c.push(bodyPara('PlugShare aggregates stations from multiple networks and allows user-contributed data. However, it lacks deep trip planning and battery-aware recommendations. Google Maps has started including EV charging stations but provides no booking functionality or EV-specific trip planning. In India, operator-specific apps like Tata Power EZ Charge, ChargeZone, and Statiq provide booking but only within their respective networks.'));
  c.push(bodyPara('OpenChargeMap represents a different approach entirely \u2014 an open-source, community-maintained global registry of charging locations. However, it does not itself offer an advanced booking or recommendation system, which is the gap that EV Charge fills.'));
  c.push(sectionHeading('2.4 Open-Source Geospatial Technologies'));
  c.push(bodyPara('Leaflet.js, developed by Vladimir Agafonkin, has become the de facto standard for open-source web mapping. OpenStreetMap provides the underlying geographic data powering many open-source mapping tools. OSRM uses OSM data to compute road network routes. Nominatim provides geocoding services as a free alternative to paid APIs.'));
  c.push(sectionHeading('2.5 Route Optimization and Trip Planning Algorithms'));
  c.push(bodyPara('Storandt (2012) proposed algorithms for computing energy-optimal routes for EVs. Sachenbacher et al. (2011) addressed energy-efficient routing with battery constraints. The core challenge is that EV routing requires considering battery state at each point, locations of charging stations, and risk of running out of charge. We implemented a greedy algorithm approach using the Haversine formula (Sinnott, 1984) for distance calculations.'));
  c.push(sectionHeading('2.6 Battery-Aware Recommendation Systems'));
  c.push(bodyPara('Qin and Zhang (2019) proposed a recommendation framework using crowd-sourced data. Cao et al. (2020) studied EV charging reservation systems under preemptive scheduling. Our scoring algorithm combines distance, congestion (availability ratio), and a battery risk factor, drawing on these concepts.'));
  c.push(sectionHeading('2.7 Slot Booking and Scheduling Systems'));
  c.push(bodyPara('The concept of advance slot booking for EV charging is relatively new. Traditional charging operates on a first-come-first-served basis, creating uncertainty at high-utilization stations. Time-slot booking systems are well established in other domains and the same principles apply to EV charging.'));
  c.push(sectionHeading('2.8 Limitations of Existing Systems'));
  c.push(bodyPara('Most platforms show only their own network\'s stations. Even aggregation platforms do not provide battery-aware scoring or integrated trip planning. None of the major Indian platforms offer advance time-slot booking with receipt generation. Commercial platforms are closed-source and subject to business model changes.'));
  c.push(sectionHeading('2.9 Research Gap'));
  c.push(bodyPara('There is no single open-source platform that combines vendor-neutral multi-network station data, battery-aware multi-factor scoring, integrated trip planning with automatic mandatory stop detection, and advance slot booking. EV Charge is designed specifically to fill this gap.'));
  return c;
}

function chapter3() {
  const c = [];
  c.push(chapterHeading('Chapter 3\nProposed Methodology'));
  c.push(sectionHeading('3.1 Introduction'));
  c.push(bodyPara('Building a platform like EV Charge requires thinking carefully about how all the pieces fit together. This chapter describes the full methodology, from defining the problem to designing and implementing each module. We took a modular, iterative development approach, building and testing each feature one at a time.'));
  c.push(sectionHeading('3.2 Problem Formulation'));
  c.push(subSectionHeading('3.2.1 Problem Definition'));
  c.push(bodyPara('The central problem is the absence of a unified, intelligent web platform where EV owners can discover charging stations from an open registry, get battery-aware recommendations, plan multi-stop trips with automatic detection of required charging stops, and reserve charging slots in advance.'));
  c.push(subSectionHeading('3.2.2 Objectives'));
  c.push(bodyPara('The primary objectives are: build a centralized platform aggregating data from OpenChargeMap; implement a multi-factor scoring algorithm; provide an interactive Leaflet.js map with clustering and color-coded markers; implement a trip planner using OSRM with automatic mandatory stop detection; offer a structured slot booking interface with receipt generation; and deliver a responsive application with dark mode, built entirely on open-source tools.'));
  c.push(sectionHeading('3.3 Solution Approach'));
  c.push(bodyPara('EV Charge is a single-page web application (SPA) built with React.js and TypeScript. It has three main functional areas: the Charging Map Explorer (stations scored and displayed with color-coded markers), the Trip Planner (geocoding via Nominatim, routing via OSRM, greedy mandatory stop detection), and the Slot Booking System (14-day calendar, time-period selection, receipt generation).'));
  c.push(sectionHeading('3.4 Software and Hardware Requirements'));
  c.push(subSectionHeading('3.4.1 Software Requirements'));
  c.push(makeTable(['Technology','Version','Purpose'],[['React.js','19.2.0','Component-based UI framework'],['TypeScript','5.9.3','Static typing for JavaScript'],['Vite','7.3.1','Build tool and dev server'],['Leaflet.js','1.9.4','Interactive web mapping'],['Zustand','5.0.11','Lightweight state management'],['Framer Motion','12.34.3','Animation library'],['TailwindCSS','3.4.19','Utility-first CSS framework'],['React Router DOM','7.13.0','Client-side routing']],[2200,1400,4500]));
  c.push(blankLine());
  c.push(makeTable(['API','Provider','Purpose'],[['OpenChargeMap API v3','Open Charge Map Community','EV station data'],['OSRM API','Project OSRM','Route computation'],['Nominatim API','OpenStreetMap Foundation','Forward geocoding'],['CARTO Tile Server','CARTO','Map tile rendering']],[2500,2800,2800]));
  c.push(subSectionHeading('3.4.2 Hardware Requirements'));
  c.push(bodyPara('Development required a laptop with at least 8 GB RAM, an i5-equivalent processor, and broadband internet. For end users, any modern device with a current browser and internet access is sufficient.'));
  c.push(subSectionHeading('3.4.3 Software Engineering Paradigm'));
  c.push(bodyPara('We followed the Agile Software Development methodology, working in iterative sprints of approximately two weeks each. Each sprint ended with a working, testable increment.'));
  c.push(sectionHeading('3.5 Implementation'));
  c.push(subSectionHeading('3.5.1 Modular Design'));
  c.push(bodyPara('The system is divided into six modules: User Authentication, Map Visualization and Station Discovery, Station Scoring and Recommendation, Trip Planning and Route Computation, Slot Booking and Receipt, and Theme Management.'));
  c.push(subSectionHeading('3.5.2 Station Scoring Algorithm'));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 160, after: 160 }, children: [new TextRun({ text: 'Score = (Distance \u00D7 0.5) + (Congestion \u00D7 30) + (BatteryRisk \u00D7 20)', font: FONT, size: 24, bold: true })] }));
  c.push(bodyPara('Distance is Haversine distance in km. Congestion is (1 \u2212 Available/Total). BatteryRisk is (Distance/50) when battery < 25%, 0 otherwise. Lower scores are better.'));
  c.push(subSectionHeading('3.5.3 Mandatory Stop Detection'));
  c.push(bodyPara('The greedy algorithm simulates the journey with the user\'s battery level and 300 km max range. It finds the farthest reachable station before depletion (with 20 km safety buffer), marks it as mandatory, assumes full charge, and repeats until the destination is reachable.'));
  c.push(sectionHeading('3.6 Algorithms Used'));
  c.push(bodyPara([boldRun('Algorithm 1: Station Scoring. '), normalRun('For each station, compute Haversine distance, congestion ratio, battery risk. Combine with weights. Sort ascending.')]));
  c.push(bodyPara([boldRun('Algorithm 2: Mandatory Stop Detection. '), normalRun('Greedy iteration: find farthest reachable station before battery depletion, mark mandatory, reset range, repeat.')]));
  c.push(bodyPara([boldRun('Algorithm 3: Minimum Distance to Route. '), normalRun('For each polyline segment, compute perpendicular distance from station. Return minimum. Used for corridor filtering.')]));
  return c;
}

function chapter4() {
  const c = [];
  c.push(chapterHeading('Chapter 4\nSystem Design and UML Diagrams'));
  c.push(sectionHeading('4.1 Introduction'));
  c.push(bodyPara('System design translates methodology into a concrete architectural plan. This chapter presents DFDs, Use Case Diagram, Class Diagram, Sequence Diagram, Activity Diagram, and system architecture.'));
  c.push(sectionHeading('4.2 Data Flow Diagrams'));
  c.push(subSectionHeading('4.2.1 Level 0 DFD'));
  c.push(bodyPara('At the highest level, EV Charge sits between the user and four external systems: OpenChargeMap API (station data), OSRM (route geometry), Nominatim (geocoding), and CARTO tile server (map tiles). The user sends inputs and receives station lists, route visualization, recommendations, and booking receipts.'));
  c.push(subSectionHeading('4.2.2 Level 1 DFD'));
  c.push(bodyPara('Five main processes: P1 (Authenticate User), P2 (Fetch & Normalize Station Data), P3 (Score & Rank Stations), P4 (Compute Route & Detect Stops), P5 (Book Slot & Generate Receipt).'));
  c.push(sectionHeading('4.3 Use Case Diagram'));
  c.push(makeTable(['Use Case','Description'],[['UC1: Register Account','Create new account'],['UC2: Login/Logout','Authenticate and manage session'],['UC3: View Map & Stations','Browse stations on interactive map'],['UC4: Search Location','Search near a specific place'],['UC5: Get Directions','Route to a selected station via OSRM'],['UC6: Plan Multi-Stop Trip','Journey planning with auto stop detection'],['UC7: Book Charging Slot','Reserve a time slot'],['UC8: View Receipt','See booking confirmation'],['UC9: Toggle Theme','Switch dark/light mode'],['UC10: Set Battery Level','Adjust battery for personalized recommendations']],[3000,5200]));
  c.push(sectionHeading('4.4 Class Diagram'));
  c.push(bodyPara([boldRun('User: '), normalRun('id, name, email. Managed by AuthStore.')]));
  c.push(bodyPara([boldRun('NormalizedStation: '), normalRun('id, name, lat, lng, total, available, powerKW, connectorTypes[], isOperational.')]));
  c.push(bodyPara([boldRun('StationWithDistance: '), normalRun('extends NormalizedStation; adds distance, reachable, score.')]));
  c.push(bodyPara([boldRun('BookingDetails: '), normalRun('station, date, period, slot.')]));
  c.push(bodyPara([boldRun('Stores: '), normalRun('AuthStore (user, login, logout), ThemeStore (isDark, toggleTheme).')]));
  c.push(sectionHeading('4.5 Sequence Diagram'));
  c.push(bodyPara('User opens Map \u2192 React gets GPS \u2192 Fetches stations from OCM \u2192 Normalizes and scores \u2192 Renders markers \u2192 User searches destination \u2192 Nominatim geocodes \u2192 OSRM computes route \u2192 Route polyline rendered.'));
  c.push(sectionHeading('4.6 Activity Diagram'));
  c.push(bodyPara('Start \u2192 Enter waypoints \u2192 Set battery \u2192 Click Plan \u2192 Geocode waypoints \u2192 Fetch OSRM route \u2192 Render route \u2192 Compute bounding box \u2192 Fetch corridor stations \u2192 Filter within 5km \u2192 Run greedy stop detection \u2192 Display results \u2192 End.'));
  c.push(sectionHeading('4.7 System Architecture'));
  c.push(bodyPara('Client-heavy layered architecture: Presentation Layer (React + TailwindCSS + Framer Motion), Navigation Layer (React Router), State Management Layer (Zustand), Business Logic Layer (scoring, Haversine, normalization), Service Layer (API clients for OCM, OSRM, Nominatim).'));
  return c;
}

function chapter5() {
  const c = [];
  c.push(chapterHeading('Chapter 5\nDatabase Design and Management'));
  c.push(sectionHeading('5.1 Introduction'));
  c.push(bodyPara('EV Charge takes a different approach from traditional applications: since all station data comes from the OpenChargeMap API in real-time, there is no need for a server-side database. User state is managed client-side using Zustand and browser localStorage.'));
  c.push(sectionHeading('5.2 Data Storage Strategy'));
  c.push(bodyPara('Three-tier approach: Tier 1 \u2014 transient API data in React state; Tier 2 \u2014 session-scoped application state in Zustand; Tier 3 \u2014 persistent theme preference in localStorage.'));
  c.push(sectionHeading('5.3 State Management'));
  c.push(makeTable(['Store','Property/Method','Description'],[['AuthStore','user: User|null','Currently authenticated user'],['AuthStore','login(user)','Set user state'],['AuthStore','logout()','Clear user state'],['ThemeStore','isDark: boolean','Current theme mode'],['ThemeStore','toggleTheme()','Switch dark/light mode']],[2000,2600,3500]));
  c.push(sectionHeading('5.4 Data Structures'));
  c.push(makeTable(['Field','Type','Source','Description'],[['id','number','OpenChargeMap','Unique station ID'],['name','string','AddressInfo.Title','Station name'],['lat, lng','number','AddressInfo','Geographic coordinates'],['total','number','Connections.length','Total charging ports'],['available','number','Simulated','Available ports'],['powerKW','number','Max Connections.PowerKW','Max power rating'],['connectorTypes','string[]','ConnectionType.Title','Connector types'],['isOperational','boolean','StatusType','Operational status']],[1800,1400,2200,2700]));
  c.push(sectionHeading('5.5 API Data Schema'));
  c.push(bodyPara('OpenChargeMap returns JSON with AddressInfo, Connections, StatusType, OperatorInfo. OSRM returns routes with geometry (GeoJSON), distance, duration. Nominatim returns lat, lon, display_name. The normalizeOCMStation function flattens nested OCM responses into a predictable format.'));
  c.push(sectionHeading('5.6 ER Diagram'));
  c.push(bodyPara('Logical relationships: User has many Bookings (1:N). Each Booking references one Station (N:1). Each Booking generates one Receipt (1:1). Station data comes from OpenChargeMap rather than a local table.'));
  c.push(sectionHeading('5.7 Data Security'));
  c.push(bodyPara('API key stored in .env with .gitignore. No sensitive data persisted. All API requests use HTTPS. User inputs validated before processing.'));
  return c;
}

function chapter6() {
  const c = [];
  c.push(chapterHeading('Chapter 6\nSystem Implementation and Working'));
  c.push(sectionHeading('6.1 Introduction'));
  c.push(bodyPara('This chapter describes how the system was actually built, covering frontend structure, map engine setup, API integration, and end-to-end user workflows.'));
  c.push(sectionHeading('6.2 Frontend Implementation'));
  c.push(bodyPara('The frontend is a Vite + React + TypeScript project with modular directory structure: src/pages for route components, src/components for reusable UI, src/features for state stores, src/services for API clients, src/utils for helpers. TailwindCSS handles styling with dark mode support. Framer Motion animates page transitions.'));
  c.push(sectionHeading('6.3 Map Engine Implementation'));
  c.push(bodyPara('Leaflet.js v1.9.4 is integrated via React-Leaflet v5. The ChargingMap component (~540 lines) uses MapContainer with TileLayer, MarkerClusterGroup, and individual Marker components. Custom SVG-based divIcon markers enable color coding. Map tiles switch between CARTO Voyager (light) and Dark Matter (dark) automatically.'));
  c.push(sectionHeading('6.4 API Integration'));
  c.push(bodyPara([boldRun('OpenChargeMap: '), normalRun('Fetches stations by lat/lng/radius or bounding box. API key in X-API-Key header. Responses normalized via normalizeOCMStation.')]));
  c.push(bodyPara([boldRun('OSRM: '), normalRun('Builds URL with waypoint coordinates, returns route geometry in GeoJSON. Coordinates converted from [lng,lat] to [lat,lng] for Leaflet.')]));
  c.push(bodyPara([boldRun('Nominatim: '), normalRun('Geocodes place names to coordinates. Returns first result with lat, lon, display_name.')]));
  c.push(sectionHeading('6.5 System Working'));
  c.push(bodyPara('Map Explorer: GPS centering \u2192 fetch stations \u2192 score and rank \u2192 display color-coded markers \u2192 search/directions/booking. Trip Planner: enter waypoints \u2192 geocode \u2192 compute route \u2192 find corridor stations \u2192 detect mandatory stops \u2192 display results. Booking: select station \u2192 pick date \u2192 pick period \u2192 pick slot \u2192 confirm \u2192 receipt.'));
  c.push(sectionHeading('6.6 Testing'));
  c.push(bodyPara('Tested station discovery in Delhi, Lucknow, Mumbai, Bangalore, Chennai. Trip planning tested on Delhi-Agra (~233km), Delhi-Jaipur (~281km), and short urban routes. Chrome DevTools used for API debugging and performance profiling. TypeScript caught many potential runtime errors at compile time.'));
  c.push(sectionHeading('6.7 Deployment'));
  c.push(bodyPara('Production build via Vite generates optimized dist/ directory with code splitting and tree shaking. Deployable to Vercel, Netlify, or any static hosting. Total build size ~1.2 MB gzipped.'));
  return c;
}

function chapter7() {
  const c = [];
  c.push(chapterHeading('Chapter 7\nSecurity and Ethical Considerations'));
  c.push(sectionHeading('7.1 Introduction'));
  c.push(bodyPara('Even though EV Charge is a client-side web application, security and privacy considerations are still important. Users share location data, and the application interacts with multiple external APIs.'));
  c.push(sectionHeading('7.2 Data Privacy'));
  c.push(bodyPara('Location data requires explicit user permission via the Geolocation API. Coordinates are used only for map centering and station fetching, not stored persistently or shared beyond API queries. No PII beyond name and email is collected.'));
  c.push(sectionHeading('7.3 Security Mechanisms'));
  c.push(makeTable(['Mechanism','Implementation','Purpose'],[['API Key Protection','.env file + .gitignore','Prevents key exposure'],['HTTPS','All API calls use HTTPS','Encrypts data in transit'],['Input Validation','Client-side form validation','Prevents malformed requests'],['XSS Prevention','React auto-escapes JSX output','Prevents script injection'],['No Sensitive Persistence','No passwords/PII stored','Minimizes exposure risk']],[2000,3000,3000]));
  c.push(sectionHeading('7.4 Ethical Use of Open-Source Data'));
  c.push(bodyPara('OpenChargeMap data is under CC BY-SA license; we provide attribution and use it for non-commercial/educational purposes. OpenStreetMap-based services operate under open licenses. CARTO tiles used with proper attribution. Platform designed to minimize unnecessary API calls to respect shared public resources.'));
  c.push(sectionHeading('7.5 Summary'));
  c.push(bodyPara('Security measures include API key protection, HTTPS, input validation, XSS prevention, and responsible API usage. Client-side authentication is acknowledged as a limitation for production deployment. All open-source data licenses are properly complied with.'));
  return c;
}

module.exports = { chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7 };
