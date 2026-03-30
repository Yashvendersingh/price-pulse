import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gray-800"
      : "hover:bg-gray-700";

  return (
    <div className="w-56 bg-black text-white h-screen p-5 flex-shrink-0">
      <h2 className="text-xl font-bold mb-6">📊 PricePulse</h2>

      <nav className="space-y-1">
        <Link
          to="/"
          className={`block p-3 rounded transition-colors ${isActive("/")}`}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/analytics"
          className={`block p-3 rounded transition-colors ${isActive("/analytics")}`}
        >
          📊 Analytics
        </Link>

        <Link
          to="/simulator"
          className={`block p-3 rounded transition-colors ${isActive("/simulator")}`}
        >
          🧪 Price Simulator
        </Link>

        <Link
          to="/settings"
          className={`block p-3 rounded transition-colors ${isActive("/settings")}`}
        >
          ⚙ Settings
        </Link>
      </nav>
    </div>
  );
}