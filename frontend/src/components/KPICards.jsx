import { getCurrencySymbol, formatPrice } from "../utils/currency";

export default function KPICards({ products }) {
  const total = products?.length || 0;

  const avgPrice =
    total > 0
      ? products.reduce((sum, p) => sum + Number(p.your_price || 0), 0) / total
      : 0;

  const avgDemand =
    total > 0
      ? products.reduce((sum, p) => sum + Number(p.demand || 0), 0) / total
      : 0;

  const compAvg =
    total > 0
      ? products.reduce(
          (sum, p) => sum + Number(p.competitor_price || 0),
          0
        ) / total
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500 dark:text-gray-400">Total Products</h4>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{total}</p>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500 dark:text-gray-400">Avg Price</h4>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{getCurrencySymbol()}{formatPrice(avgPrice)}</p>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500 dark:text-gray-400">Avg Demand</h4>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{avgDemand.toFixed(2)}</p>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500 dark:text-gray-400">Competitor Avg</h4>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{getCurrencySymbol()}{formatPrice(compAvg)}</p>
      </div>
    </div>
  );
}