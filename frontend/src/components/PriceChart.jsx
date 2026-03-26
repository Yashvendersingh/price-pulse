import React from "react";

export default function PriceChart({ dataset }) {
  const max = Math.max(...dataset.map((item) => item.value), 1);
  return (
    <div className="card chart-card">
      <h3>Price History Chart</h3>
      <div className="chart-grid">
        {dataset.map((point, i) => (
          <div className="chart-bar-wrapper" key={i}>
            <div
              className="chart-bar"
              style={{ height: `${(point.value / max) * 100}%` }}
              title={`${point.label}: ${point.value.toFixed(2)}`}
            />
            <small>{point.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}