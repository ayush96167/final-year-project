import L from "leaflet";

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

export const greenIcon = createIcon("#22c55e");   // Tailwind green-500
export const yellowIcon = createIcon("#eab308");  // Tailwind yellow-500
export const redIcon = createIcon("#ef4444");     // Tailwind red-500
