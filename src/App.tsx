import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MapView from "./pages/MapView";
import BookSlot from "./pages/BookSlot";
import TripPlanner from "./pages/TripPlanner";
import Receipt from "./pages/Receipt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/ui/navbar";

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
}
