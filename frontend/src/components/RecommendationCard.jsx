import React from "react";

export default function RecommendationCard({ rec }) {
  if (!rec)
    return (
      <div className="card recommend-card">
        <h3>ML Recommendation</h3>
        <p>Prediction data nahin hai. Form fill karke Predict karein.</p>
      </div>
    );

  return (
    <div className="card recommend-card">
      <h3>ML Recommendation</h3>
      <ul>
        <li>Competitor Price: {rec.competitor_price.toFixed(2)}</li>
        <li>Demand: {rec.demand}</li>
        <li>Predicted ML: {rec.ml_price.toFixed(2)}</li>
        <li>Final Price: {rec.recommended_price.toFixed(2)}</li>
      </ul>
    </div>
  );
}