import ChargingMap from "../components/map/ChargingMap";




export default function MapView() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <ChargingMap />
    </div>
  );
}
