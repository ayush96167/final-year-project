const OPENCHARGE_API_KEY =
  import.meta.env.VITE_OPENCHARGE_API_KEY || "8bd90b35-ea91-47a3-af1f-3db0305a0141";

export async function fetchChargingStations(
  lat: number,
  lng: number,
  distanceKm = 25
) {
  const response = await fetch(
    `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lng}&distance=${distanceKm}&distanceunit=KM&maxresults=200`,
    {
      headers: {
        "X-API-Key": OPENCHARGE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch charging stations");
  }

  return response.json();
}

export async function fetchStationsInBoundingBox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number
) {
  const response = await fetch(
    `https://api.openchargemap.io/v3/poi/?output=json&boundingbox=(${minLat},${minLng}),(${maxLat},${maxLng})&maxresults=500`,
    {
      headers: {
        "X-API-Key": OPENCHARGE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch charging stations by bounding box");
  }

  return response.json();
}