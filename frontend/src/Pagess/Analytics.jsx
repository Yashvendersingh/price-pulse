import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <h2>Loading analytics...</h2>;

  const topDemand = [...products].sort((a, b) => b.demand - a.demand).slice(0, 10);
  
  const priceComparison = products.slice(0, 15).map(p => ({
    name: p.product_name.substring(0, 15) + '...',
    YourPrice: Number(p.your_price || 0),
    Competitor: Number(p.competitor_price || 0),
    Suggested: Number(p.suggested_price || 0)
  }));

  const winRate = products.filter(p => Number(p.your_price || 0) <= Number(p.competitor_price || 0)).length;
  const winPercent = ((winRate / (products.length || 1)) * 100).toFixed(1);

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 min-h-screen p-8 transition-colors">
        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            📊 Deep Analytics
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Total Products Tracked</h3>
              <p className="text-3xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Competitive Edge (Matched/Cheaper)</h3>
              <p className="text-3xl font-bold text-green-600">{winPercent}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Needs Price Adjustment</h3>
              <p className="text-3xl font-bold text-orange-500">{products.length - winRate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1 */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Price Comparison (Top 15)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="YourPrice" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Competitor" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Suggested" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2 */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Highest Demand Products</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDemand}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}