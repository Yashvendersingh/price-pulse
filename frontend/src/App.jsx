import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pagess/Dashboard";
import ProductDetail from "./Pagess/ProductDetail";
import Analytics from "./Pagess/Analytics";
import Settings from "./Pagess/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        {/* 🔥 SIDEBAR */}
        <Sidebar />

        {/* 🔥 MAIN AREA */}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-100 dark:bg-[#1a1a1a] transition-colors duration-300">

          {/* 🔥 NAVBAR */}
          <Navbar />

          {/* 🔥 PAGE CONTENT */}
          <div className="p-6 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}