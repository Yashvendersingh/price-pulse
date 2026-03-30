import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PriceChart from "../components/PriceChart";
import History from "../components/History";
import ComparisonChart from "../components/ComparisonChart";
import {
  getDashboard,
  getRecommendation,
  getComparison,
  getHistory,
} from "../api";
import { getCurrencySymbol, formatPrice, convertPrice } from "../utils/currency";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getDashboard();

        const selected = all.find(
          (p) => p.product_id === Number(id)
        );

        setProduct(selected);

        if (selected) {
          const rec = await getRecommendation(id);
          setPrediction(rec);

          const comp = await getComparison(id);
         setComparison(comp); 

          const hist = await getHistory(id);
          setHistory(hist);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  const yourPrice = product.your_price ?? 0;
  const competitor = product.competitor_price ?? 0;

  const gap = yourPrice - competitor;

  const percentDiff =
    yourPrice > 0
      ? (((prediction?.final_price - yourPrice) / yourPrice) * 100).toFixed(1)
      : 0;

 
  const chartHistory = history.map(h => ({
    date: new Date(h.timestamp).toLocaleDateString(),
    price: convertPrice(h.price),
    competitor: convertPrice(competitor), 
  })).reverse(); 
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {}
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {product.product_name}
      </h1>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Your Price</h3>
          <p className="text-2xl font-bold">{getCurrencySymbol()}{formatPrice(yourPrice)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Competitor Price</h3>
          <p className="text-2xl font-bold">
            {competitor ? `${getCurrencySymbol()}${formatPrice(competitor)}` : "N/A"}
          </p>
        </div>

      </div>

      {}
      <ComparisonChart yourPrice={yourPrice} competitorPrice={competitor} />

      {}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">
          📊 Price Gap
        </h3>

        <p
          className={`text-xl font-bold ${
            gap > 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {getCurrencySymbol()}{formatPrice(Math.abs(gap))} ({gap > 0 ? "Expensive ❌" : "Competitive ✅"})
        </p>
      </div>

      {}
      {comparison && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">
            ⚔ Price Comparison
          </h3>
          <p>Gap: {getCurrencySymbol()}{formatPrice(Math.abs(comparison.price_gap))}</p>
          <p>
            Status:{" "}
            {comparison.cheapest
              ? "You are cheapest ✅"
              : "Competitor cheaper ❌"}
          </p>
        </div>
      )}

      {}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">
          🤖 AI Recommendation
        </h3>

        {prediction ? (
          <>
            <p>ML Price: {getCurrencySymbol()}{formatPrice(prediction.ml_price)}</p>

            <p className="text-blue-600 font-bold">
              Final Price: {getCurrencySymbol()}{formatPrice(prediction.final_price)}
            </p>

            <p>
              Change: {percentDiff}%{" "}
              {percentDiff > 0 ? "📈" : "📉"}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold">
          📈 Demand
        </h3>
        <p className="text-xl font-bold">
          {product.demand}
        </p>
      </div>

      {}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          📉 Price History
        </h3>
        <PriceChart history={chartHistory} />
      </div>

      {}
      <History productId={id} />

    </div>
  );
}