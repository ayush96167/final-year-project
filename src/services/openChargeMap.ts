export async function fetchChargingStations(
  lat: number,
  lng: number,
  distanceKm = 25
) {
  const response = await fetch(
    `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lng}&distance=${distanceKm}&distanceunit=KM&maxresults=200`,
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