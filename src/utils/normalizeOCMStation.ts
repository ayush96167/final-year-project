export function normalizeOCMStation(station: any) {
  const connections = station.Connections || [];

  return {
    id: station.ID,
    name: station.AddressInfo?.Title || "Charging Station",
    lat: station.AddressInfo.Latitude,
    lng: station.AddressInfo.Longitude,

    total: connections.length || 1,
    available: connections.length || 1, // simulated availability

    powerKW: Math.max(
      ...connections.map((c: any) => c.PowerKW || 0),
      0
    ),

    connectorTypes: connections
      .map((c: any) => c.ConnectionType?.Title)
      .filter(Boolean),

    isOperational: station.StatusType?.IsOperational ?? true,
  };
}