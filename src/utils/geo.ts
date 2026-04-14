export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
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
}

export function distanceToSegment(pLat: number, pLng: number, vLat: number, vLng: number, wLat: number, wLng: number) {
  // Approximate distance using Equirectangular approximation for small distances
  // Convert lat/lng to radians
  const x = (wLng - vLng) * Math.cos((vLat + wLat) / 2 * Math.PI / 180);
  const y = wLat - vLat;
  const l2 = x*x + y*y;

  if (l2 === 0) return haversineDistance(pLat, pLng, vLat, vLng);

  const px = (pLng - vLng) * Math.cos((vLat + wLat) / 2 * Math.PI / 180);
  const py = pLat - vLat;
  
  let t = ((px * x) + (py * y)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projLng = vLng + t * (wLng - vLng);
  const projLat = vLat + t * (wLat - vLat);

  return haversineDistance(pLat, pLng, projLat, projLng);
}

export function minDistanceToPolyline(lat: number, lng: number, polyline: [number, number][]) {
  let minD = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = distanceToSegment(lat, lng, polyline[i][0], polyline[i][1], polyline[i+1][0], polyline[i+1][1]);
    if (d < minD) minD = d;
  }
  return minD;
}
