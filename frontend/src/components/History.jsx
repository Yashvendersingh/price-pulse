import { useState, useEffect } from "react";
import { getHistory } from "../api";

export default function History({ productId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory(productId).then(setHistory);
  }, [productId]);

  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No price history available 📉
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4">📈 Price History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{new Date(h.timestamp).toLocaleDateString()}</td>
                <td className="p-3">₹{h.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}