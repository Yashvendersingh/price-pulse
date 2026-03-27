import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pagess/Dashboard";
import ProductDetail from "./Pagess/ProductDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        {/* 🔥 SIDEBAR */}
        <Sidebar />

        {/* 🔥 MAIN AREA */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* 🔥 NAVBAR */}
          <Navbar />

          {/* 🔥 PAGE CONTENT */}
          <div className="p-6 bg-gray-100 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={<h1>Analytics Coming Soon 📊</h1>} />
              <Route path="/settings" element={<h1>Settings Page ⚙</h1>} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}