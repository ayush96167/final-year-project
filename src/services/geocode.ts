export async function geocodePlace(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
  );

  const data = await res.json();

  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}