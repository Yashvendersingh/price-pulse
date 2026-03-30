import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pagess/Dashboard";
import ProductDetail from "./Pagess/ProductDetail";
import Analytics from "./Pagess/Analytics";
import Settings from "./Pagess/Settings";
import Simulator from "./Pagess/Simulator";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-black text-gray-300 dark:text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">Page not found</p>
      <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
        Back to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen bg-gray-100 dark:bg-[#1a1a1a] transition-colors duration-300">
          <Navbar />

          <div className="p-6 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}