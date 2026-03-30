import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrencySymbol, formatPrice } from "../utils/currency";

export default function ProductTable({ products }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const itemsPerPage = 10;

  const uniqueBrands = useMemo(() => {
    if (!products) return ["All Brands"];
    const brands = new Set(
      products.map(p => {
        const firstWord = p.product_name.trim().split(" ")[0];
    
        return firstWord.replace(/[^a-zA-Z0-9]/g, ''); 
      }).filter(Boolean)
    );
    return ["All Brands", ...Array.from(brands).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products;

    if (selectedBrand !== "All Brands") {
      result = result.filter(p => p.product_name.trim().split(" ")[0].replace(/[^a-zA-Z0-9]/g, '') === selectedBrand);
    }

    if (selectedStatus !== "All Statuses") {
      result = result.filter(p => {
        const suggested = p.suggested_price ?? 0;
        const yourPrice = p.your_price ?? 0;
        const currentStatus = suggested > yourPrice ? "Increase" : "Decrease";
        return currentStatus === selectedStatus;
      });
    }

    return result;
  }, [products, selectedBrand, selectedStatus]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedStatus]);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found 🚫
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full">
      {}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1f1f1f] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full md:w-auto">
          {}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
              🏢 Filter by Brand:
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full sm:w-48 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors outline-none cursor-pointer"
            >
              {uniqueBrands.map((brand, idx) => (
                <option key={idx} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
              📊 Action Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-48 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors outline-none cursor-pointer"
            >
              <option value="All Statuses">All Matches</option>
              <option value="Increase">Increase 📈</option>
              <option value="Decrease">Decrease 📉</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Found <span className="font-bold text-gray-800 dark:text-gray-200">{filteredProducts.length}</span> results
        </div>
      </div>

      <div className="shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left font-semibold">Product</th>
                <th className="p-4 text-left font-semibold">Your Price</th>
                <th className="p-4 text-left font-semibold">Competitor</th>
                <th className="p-4 text-left font-semibold">Suggested</th>
                <th className="p-4 text-left font-semibold">Difference %</th>
                <th className="p-4 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-[#1f1f1f] divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {currentItems.length > 0 ? (
                currentItems.map((p) => {
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
                      className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors duration-150"
                    >
                      <td className="p-4 font-medium dark:text-white">{p.product_name}</td>
                      <td className="p-4">{getCurrencySymbol()}{formatPrice(yourPrice)}</td>
                      <td className="p-4">{getCurrencySymbol()}{formatPrice(competitor)}</td>
                      <td className="p-4 text-blue-600 dark:text-blue-400 font-bold">
                        {getCurrencySymbol()}{formatPrice(suggested)}
                      </td>
                      <td className="p-4 font-medium">{diff}%</td>
                      <td
                        className={`p-4 font-bold ${
                          suggested > yourPrice
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {suggested > yourPrice ? "Increase 📈" : "Decrease 📉"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No matching products found. Try adjusting your filters!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length === 0 ? 0 : startIndex + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                currentPage === 1 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow'
              }`}
            >
              Previous
            </button>
            <div className="flex items-center px-4 font-medium text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                currentPage === totalPages || totalPages === 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}