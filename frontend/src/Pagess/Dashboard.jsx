import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import ProductTable from "../components/ProductTable";
import KPICards from "../components/KPICards";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div className="flex">
      
      <div className="flex-1 bg-gray-100 min-h-screen p-8">

        <div className="max-w-6xl mx-auto text-left">

          <h1 className="text-4xl font-bold mb-8 text-center">
            🔥 Intelligent Pricing Dashboard
          </h1>

          {/* ✅ KPI CARDS */}
          <KPICards products={products} />

          {/* ✅ TABLE */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <ProductTable products={products} />
          </div>

        </div>

      </div>
    </div>
  );
}