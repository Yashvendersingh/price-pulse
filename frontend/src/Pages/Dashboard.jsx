import React, { useState } from "react";
import ProductTable from "../components/ProductTable";
import PriceChart from "../components/PriceChart";
import RecommendationCard from "../components/RecommendationCard";
import { fetchPricePrediction } from "../api";

const sampleProducts = [
  { product_id: 1, product_name: "Smartphone X", category: "Electronics", base_price: 450, current_price: 470, demand: 360, stock_quantity: 90, competitor_avg_price: 495, suggested_price: 505, price_difference: 7.4, last_updated: "2026-03-26" },
  { product_id: 2, product_name: "Headphones Pro", category: "Audio", base_price: 70, current_price: 80, demand: 240, stock_quantity: 170, competitor_avg_price: 82, suggested_price: 78, price_difference: -2.5, last_updated: "2026-03-25" },
  { product_id: 3, product_name: "Running Shoes", category: "Footwear", base_price: 110, current_price: 120, demand: 420, stock_quantity: 55, competitor_avg_price: 125, suggested_price: 118, price_difference: -4.0, last_updated: "2026-03-24" },
];

export default function Dashboard() {
  const [competitorPrice, setCompetitorPrice] = useState("");
  const [demand, setDemand] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const onPredict = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const resp = await fetchPricePrediction(Number(competitorPrice), Number(demand));
      setResult(resp);
      setHistory((prev) => [{...resp, at: new Date().toLocaleString()}, ...prev].slice(0, 10));
    } catch (err) {
      setMessage(err.message || "Error aaya");
      setResult(null);
    }
  };

  const chartData = history.length
    ? history.map((item, idx) => ({ label: `${idx + 1}`, value: item.recommended_price }))
    : sampleProducts.map((p) => ({ label: p.product_name.slice(0, 2), value: p.current_price }));

  return (
    <main className="dashboard">
      <form className="card form-card" onSubmit={onPredict}>
        <h3>Predict Price</h3>
        <label>
          Competitor Price
          <input type="number" required value={competitorPrice} onChange={(e) => setCompetitorPrice(e.target.value)} />
        </label>

        <label>
          Demand (numeric)
          <input type="number" required value={demand} onChange={(e) => setDemand(e.target.value)} />
        </label>

        <button type="submit">Predict</button>
        {message && <p className="error-message">{message}</p>}
      </form>

      <RecommendationCard rec={result} />

      <div className="grid-two">
        <ProductTable products={sampleProducts} />
        <PriceChart dataset={chartData} />
      </div>

      {history.length > 0 && (
        <div className="card">
          <h3>Recent Predictions</h3>
          <ul>
            {history.map((item, i) => (
              <li key={i}>
                {item.at}: {item.competitor_price} | {item.demand} | {item.recommended_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}