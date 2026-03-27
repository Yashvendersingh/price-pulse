import { useEffect, useState, useMemo } from "react";
import { getDashboard } from "../api";
import { convertPrice, getCurrencySymbol } from "../utils/currency";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  useEffect(() => {
    getDashboard().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Extract unique brands dynamically (same logic as ProductTable)
  const uniqueBrands = useMemo(() => {
    if (!products) return ["All Brands"];
    const brands = new Set(
      products.map(p => {
        const firstWord = p.product_name.trim().split(" ")[0];
        return firstWord.replace(/[^a-zA-Z0-9]/g, ''); 
      }).filter(Boolean)
    );
    return ["All Brands", ...Array.from(brands).sort()];
  }, [products]);

  // Filter products by selected brand
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedBrand === "All Brands") return products;
    return products.filter(p => p.product_name.trim().split(" ")[0].replace(/[^a-zA-Z0-9]/g, '') === selectedBrand);
  }, [products, selectedBrand]);

  if (loading) return <h2>Loading analytics...</h2>;

  const topDemand = [...filteredProducts].sort((a, b) => b.demand - a.demand).slice(0, 10);
  
  const priceComparison = filteredProducts.slice(0, 15).map(p => ({
    name: p.product_name.substring(0, 15) + '...',
    YourPrice: convertPrice(p.your_price || 0),
    Competitor: convertPrice(p.competitor_price || 0),
    Suggested: convertPrice(p.suggested_price || 0)
  }));

  const winRate = filteredProducts.filter(p => Number(p.your_price || 0) <= Number(p.competitor_price || 0)).length;
  const winPercent = ((winRate / (filteredProducts.length || 1)) * 100).toFixed(1);

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 dark:bg-[#121212] min-h-screen p-8 transition-colors">
        <div className="max-w-6xl mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              📊 Deep Analytics
            </h1>
            
            {/* Brand Filter Dropdown */}
            <div className="bg-white dark:bg-[#1f1f1f] p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Filter by Brand:
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-50 dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors outline-none cursor-pointer min-w-[150px]"
              >
                {uniqueBrands.map((brand, idx) => (
                  <option key={idx} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800">
              <h3 className="text-gray-500 dark:text-gray-400">Total Products</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{filteredProducts.length}</p>
            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800">
              <h3 className="text-gray-500 dark:text-gray-400">Competitive Edge</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{winPercent}%</p>
            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800">
              <h3 className="text-gray-500 dark:text-gray-400">Needs Adjustment</h3>
              <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">{filteredProducts.length - winRate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1 */}
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Price Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} tick={{fill: '#8b92a5'}} />
                  <YAxis tick={{fill: '#8b92a5'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="YourPrice" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Competitor" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Suggested" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2 */}
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Highest Demand</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                  <XAxis dataKey="product_name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} tick={{fill: '#8b92a5'}} />
                  <YAxis tick={{fill: '#8b92a5'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="demand" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}