import { useState, useEffect } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Listen for storage changes (Settings page toggle)
  useEffect(() => {
    const handleStorage = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="px-6 py-4 bg-[#111] dark:bg-[#0a0a0a] text-white flex justify-between items-center border-b border-gray-800 transition-colors duration-300">
      <h2 className="text-lg font-bold tracking-tight">📊 PricePulse</h2>

      <div className="flex items-center space-x-5">
        <span className="text-sm text-gray-400 hidden sm:inline">Dashboard</span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl hover:scale-110 transition-transform"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <span className="text-sm cursor-pointer hover:text-gray-300 transition-colors">👤 User</span>
      </div>
    </div>
  );
}