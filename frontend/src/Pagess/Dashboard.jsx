import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import ProductTable from "../components/ProductTable";
import KPICards from "../components/KPICards";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getDashboard().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.product_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
    if (search) {
      setNotification({ message: `Found ${filtered.length} products matching "${search}"`, type: "info" });
    }
  }, [search, products]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 dark:bg-[#121212] min-h-screen p-8 transition-colors duration-300">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white animate-fade-in">
            🔥 Intelligent Pricing Dashboard
          </h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <KPICards products={filteredProducts} />

          <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow p-6 mt-6 border border-gray-100 dark:border-gray-800 animate-slide-up">
            <ProductTable products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}