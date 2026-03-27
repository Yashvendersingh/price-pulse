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

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500">Total Products</h4>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500">Avg Price</h4>
        <p className="text-2xl font-bold">₹{avgPrice.toFixed(0)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500">Avg Demand</h4>
        <p className="text-2xl font-bold">{avgDemand.toFixed(2)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
        <h4 className="text-gray-500">Competitor Avg</h4>
        <p className="text-2xl font-bold">₹{compAvg.toFixed(0)}</p>
      </div>

    </div>
  );
}