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
    setFilteredProducts(
      products.filter(p =>
        p.product_name.toLowerCase().includes(search.toLowerCase())
      )
    );
    if (search) {
      setNotification({ message: `Found ${filteredProducts.length} products matching "${search}"`, type: "info" });
    }
  }, [search, products]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      
      <div className="flex-1 bg-gray-100 min-h-screen p-8">

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="max-w-6xl mx-auto text-left">

          <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">
            🔥 Intelligent Pricing Dashboard
          </h1>

          {}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {}
          <KPICards products={filteredProducts} />

        {}
          <div className="bg-white rounded-xl shadow p-6 mt-6 animate-slide-up">
            <ProductTable products={filteredProducts} />
          </div>

        </div>

      </div>
    </div>
  );
}