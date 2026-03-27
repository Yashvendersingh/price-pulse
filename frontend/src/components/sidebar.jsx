import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gray-800"
      : "hover:bg-gray-700";

  return (
    <div className="w-56 bg-black text-white h-screen p-5">

      <h2 className="text-xl font-bold mb-6">📊 PricePulse</h2>

      {/* Dashboard */}
      <Link
        to="/"
        className={`block p-3 rounded ${isActive("/")}`}
      >
        🏠 Dashboard
      </Link>

      {/* Products */}
      <Link
        to="/product/1"
        className={`block p-3 rounded ${isActive("/product/1")}`}
      >
        📦 Products
      </Link>

      {/* ✅ FIXED ANALYTICS */}
      <Link
        to="/analytics"
        className={`block p-3 rounded ${isActive("/analytics")}`}
      >
        📊 Analytics
      </Link>

      {/* Settings */}
      <Link
        to="/settings"
        className={`block p-3 rounded ${isActive("/settings")}`}
      >
        ⚙ Settings
      </Link>

    </div>
  );
}