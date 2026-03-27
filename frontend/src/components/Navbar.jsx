// components/Navbar.jsx
export default function Navbar() {
  return (
    <div
      style={{
        padding: "15px 25px",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 🔥 LEFT */}
      <h2 style={{ margin: 0 }}>📊 PricePulse</h2>

      {/* 🔥 RIGHT */}
      <div>
        <span style={{ marginRight: "20px" }}>Dashboard</span>
        <span style={{ cursor: "pointer" }}>👤 User</span>
      </div>
    </div>
  );
}