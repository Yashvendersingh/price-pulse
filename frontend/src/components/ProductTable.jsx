import { useNavigate } from "react-router-dom";
export default function ProductTable({ products }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found 🚫
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full table-auto border border-gray-200 rounded-lg">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Your Price</th>
            <th className="p-3 text-left">Competitor</th>
            <th className="p-3 text-left">Suggested</th>
            <th className="p-3 text-left">Difference %</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const suggested = p.suggested_price ?? 0;
            const yourPrice = p.your_price ?? 0;
            const competitor = p.competitor_price ?? 0;

            const diff =
              yourPrice > 0
                ? (((suggested - yourPrice) / yourPrice) * 100).toFixed(1)
                : 0;

            return (
              <tr
                key={p.product_id}
                onClick={() => navigate(`/product/${p.product_id}`)}
                className="border-t hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="p-3 font-medium">{p.product_name}</td>

                <td className="p-3">₹{yourPrice}</td>

                <td className="p-3">₹{competitor}</td>

                <td className="p-3 text-blue-600 font-semibold">
                  ₹{suggested.toFixed(0)}
                </td>

                <td className="p-3">{diff}%</td>

                <td
                  className={`p-3 font-semibold ${
                    suggested > yourPrice
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {suggested > yourPrice
                    ? "Increase 📈"
                    : "Decrease 📉"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}