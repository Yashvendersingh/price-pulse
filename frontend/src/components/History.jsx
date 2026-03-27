import { useState, useEffect, useMemo } from "react";
import { getHistory } from "../api";
import { getCurrencySymbol, formatPrice } from "../utils/currency";

export default function History({ productId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory(productId).then(setHistory);
  }, [productId]);

  // Group the identical records together by Date and Price
  const groupedHistory = useMemo(() => {
    if (!history) return [];
    
    const map = new Map();
    
    history.forEach((h) => {
      const dateStr = new Date(h.timestamp).toLocaleDateString();
      const priceStr = h.price; // Group by precise raw price
      
      const key = `${dateStr}-${priceStr}`;
      
      if (map.has(key)) {
        map.get(key).count += 1;
      } else {
        map.set(key, { ...h, dateStr, count: 1 });
      }
    });

    // Retain accurate chronological sorting from highest timestamp to lowest
    return Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [history]);

  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 dark:text-gray-400">
        No price history available 📉
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow-sm mt-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        📈 Logged Price History
      </h3>
      
      <div className="overflow-x-auto w-full rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-4 text-left font-semibold">Date Logged</th>
              <th className="p-4 text-left font-semibold">Tracked Price</th>
              <th className="p-4 text-left font-semibold">Occurrences</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#1f1f1f] divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            {groupedHistory.map((h, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors duration-150">
                <td className="p-4 font-medium">{h.dateStr}</td>
                
                <td className="p-4 font-semibold text-gray-900 dark:text-white">
                  {getCurrencySymbol()}{formatPrice(h.price)}
                </td>
                
                <td className="p-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    h.count > 1 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  }`}>
                    {h.count} {h.count === 1 ? 'time' : 'times'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {groupedHistory.length > 0 && groupedHistory.length !== history.length && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          * Collapsed {history.length - groupedHistory.length} duplicate records that occurred on the same day at the exact same price.
        </div>
      )}
    </div>
  );
}