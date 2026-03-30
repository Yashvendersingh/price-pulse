import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pagess/Dashboard";
import ProductDetail from "./Pagess/ProductDetail";
import Analytics from "./Pagess/Analytics";
import Settings from "./Pagess/Settings";
import Simulator from "./Pagess/Simulator";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        {}
        <Sidebar />

        {}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-100 dark:bg-[#1a1a1a] transition-colors duration-300">

          {}
          <Navbar />

          {}
          <div className="p-6 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/simulator" element={<Simulator />} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}