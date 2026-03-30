import { getCurrencySymbol, formatPrice } from "../utils/currency";

export default function RecommendationCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🤖 AI Recommendation
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">ML Price</p>
          <p className="font-bold text-lg text-gray-800 dark:text-white">
            {getCurrencySymbol()}{formatPrice(data.ml_price)}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Final Price</p>
          <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
            {getCurrencySymbol()}{formatPrice(data.final_price)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {data.final_price > data.ml_price
          ? "📈 Demand high → increase price"
          : "📉 Competition high → reduce price"}
      </p>
    </div>
  );
}