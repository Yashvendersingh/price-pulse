// components/Navbar.jsx
import { useState, useEffect } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      style={{
        padding: "15px 25px",
        background: darkMode ? "#333" : "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "background 0.3s",
      }}
    >
      {}
      <h2 style={{ margin: 0 }}>📊 PricePulse</h2>

      {}
      <div>
        <span style={{ marginRight: "20px" }}>Dashboard</span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginRight: "20px",
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <span style={{ cursor: "pointer" }}>👤 User</span>
      </div>
    </div>
  );
}