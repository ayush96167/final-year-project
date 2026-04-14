import ChargingMap from "../components/map/ChargingMap";

export default function MapView() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#fbfbfd]">
      <ChargingMap />
    </div>
  );
}
