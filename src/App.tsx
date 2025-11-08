import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import A from "./pages/a";
import Surprise from "./pages/Surprise";
import Closing from "./pages/Closing";
import { Routes, Route } from "react-router-dom";
import Message1 from "./pages/Message1";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/surprise" element={<Surprise />} />
        <Route path="/closing" element={<Closing />} />
        <Route path="/message" element={<Message1 />} />
        <Route path="/a" element={<A />} />
      </Routes>
      <Footer />
    </div>
  );
}
