export default function RecommendationCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        🤖 AI Recommendation
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-gray-500">ML Price</p>
          <p className="font-bold text-lg">
            ₹{data.ml_price.toFixed(0)}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Final Price</p>
          <p className="font-bold text-lg text-blue-600">
            ₹{data.final_price.toFixed(0)}
          </p>
        </div>

      </div>

      <p className="mt-4 text-sm text-gray-600">
        {data.final_price > data.ml_price
          ? "📈 Demand high → increase price"
          : "📉 Competition high → reduce price"}
      </p>
    </div>
  );
}