import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Menu</h2>
      <nav>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">History</a></li>
          <li><a href="#">ML Recommendation</a></li>
        </ul>
      </nav>
    </aside>
  );
}