import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import KPICards from "../components/KPICards";
import ProductTable from "../components/ProductTable";

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

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-8 text-center">
            📊 Analytics Dashboard
          </h1>

          {/* KPI CARDS */}
          <KPICards products={products} />

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Product Analytics</h2>
            <ProductTable products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}