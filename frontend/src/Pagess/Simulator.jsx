import { useState } from "react";
import { simulatePrice } from "../api";
import { getCurrencySymbol, formatPrice } from "../utils/currency";

export default function Simulator() {
   const [formData, setFormData] = useState({
      product_name: "",
      base_price: "",
      competitor_price: "",
      demand: 0.5
   });
   const [result, setResult] = useState(null);
   const [loading, setLoading] = useState(false);

   const handleCalculate = async (e) => {
      e.preventDefault();
      if (!formData.base_price || !formData.competitor_price) return;

      setLoading(true);

      const data = await simulatePrice(formData);
      setResult(data);
      setLoading(false);
   };

   return (
      <div className="max-w-5xl mx-auto py-8">
         <div className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
            <div className="flex items-center space-x-3 mb-8">
               <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                  <span className="text-2xl">⚡</span>
               </div>
               <div>
                  <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Demand Simulator V4</h1>
                  <p className="text-gray-500 dark:text-gray-400">Direct Linear & Competitor Targeting Engine</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Form Side */}
               <form onSubmit={handleCalculate} className="space-y-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 tracking-widest">Product Reference</label>
                        <input
                           type="text"
                           placeholder="e.g. iPhone 17"
                           value={formData.product_name}
                           onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                           className="w-full p-4 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Original Price ({getCurrencySymbol()})</label>
                           <input
                              type="number"
                              required
                              placeholder="0.00"
                              value={formData.base_price}
                              onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                              className="w-full p-4 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-mono text-lg"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Competitor Prices</label>
                           <input
                              type="text"
                              required
                              placeholder="e.g. 68000, 72000"
                              value={formData.competitor_price}
                              onChange={(e) => setFormData({ ...formData, competitor_price: e.target.value })}
                              className="w-full p-4 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-mono"
                           />
                           <p className="text-[10px] text-gray-400 mt-1">* Targeting the individual minimum</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6 p-7 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-800/20">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Linear Market Demand</h3>
                        <div className="px-4 py-1.5 bg-white dark:bg-[#1a1a1a] rounded-full shadow-sm border border-indigo-100 dark:border-indigo-800/40">
                           <span className="text-indigo-700 dark:text-indigo-300 font-mono text-sm font-black">{(formData.demand * 100).toFixed(0)}%</span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <input
                           type="range"
                           min="0.0"
                           max="1.0"
                           step="0.01"
                           value={formData.demand}
                           onChange={(e) => setFormData({ ...formData, demand: parseFloat(e.target.value) })}
                           className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-xl appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                        />
                        <div className="grid grid-cols-3 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                           <div className="text-left">
                              <span className="block text-rose-500">Low Demand</span>
                              <span className="font-normal opacity-60">Priced to Sell (-8%)</span>
                           </div>
                           <div className="text-center opacity-40 pt-1">Neutral (40%)</div>
                           <div className="text-right">
                              <span className="block text-emerald-500">Peak Demand</span>
                              <span className="font-normal opacity-60">Premium Alpha (+12%)</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className={`w-full py-6 rounded-[2rem] font-black text-xl text-white shadow-2xl shadow-indigo-500/20 transition-all transform active:scale-[0.97] ${loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                  >
                     {loading ? "Analyzing Sensitivity..." : "🚀 Optimize Market Price"}
                  </button>
               </form>

               {/* Results Side */}
               <div className="flex flex-col gap-6">
                  {!result ? (
                     <div className="text-center p-16 border-2 border-dashed border-indigo-100 dark:border-indigo-900/40 rounded-[3rem] h-full flex flex-col justify-center bg-gray-50/30 dark:bg-[#1a1a1a]/30 transition-all">
                        <div className="text-7xl mb-8 filter drop-shadow-lg">📡</div>
                        <h4 className="text-indigo-900/40 dark:text-white/20 font-black text-2xl tracking-tighter uppercase">Waiting for Input</h4>
                        <p className="text-gray-400 text-sm mt-4 font-medium italic">Adjust the demand slider to see <br /> real-time linear sensitivity.</p>
                     </div>
                  ) : (
                     <div className="w-full space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="relative group overflow-hidden">
                           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                           <div className="relative bg-white dark:bg-[#252525] p-10 rounded-[3rem] border border-white dark:border-gray-800 shadow-2xl">
                              <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4">Strategic Recommendation</p>
                              <h2 className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
                                 {getCurrencySymbol()}{formatPrice(result.suggested_price)}
                              </h2>
                              <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${result.status.includes("Increase")
                                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                                    : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
                                 }`}>
                                 {result.status} {result.status.includes("Increase") ? "↑" : "↓"}
                              </div>
                           </div>
                        </div>

                        <div className="bg-gray-50/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                           <div className="flex items-center space-x-4 mb-4">
                              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Logic Breakdown</span>
                              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                           </div>

                           <div className="grid grid-cols-1 gap-4">
                              <div className="flex justify-between items-center p-5 bg-white dark:bg-[#2d2d2d] rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-black uppercase">Competition Match</span>
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 italic truncate max-w-[150px]">Targeting Lowest Offer</span>
                                 </div>
                                 <span className="font-mono font-black text-lg text-indigo-600 dark:text-indigo-400">
                                    {getCurrencySymbol()}{formatPrice(result.comp_price_used)}
                                 </span>
                              </div>

                              <div className="p-6 bg-white dark:bg-[#2d2d2d] rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                 <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] text-gray-400 font-black uppercase">Linear Sensitivity</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${formData.demand < 0.3 ? "bg-rose-100 text-rose-600" : formData.demand > 0.7 ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>
                                       {formData.demand < 0.3 ? "Aggressive Cut" : formData.demand > 0.7 ? "Premium Surge" : "Balanced Weight"}
                                    </span>
                                 </div>
                                 <div className="flex items-center space-x-3">
                                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                       <div
                                          className="h-full bg-indigo-500 transition-all duration-1000"
                                          style={{ width: `${formData.demand * 100}%` }}
                                       ></div>
                                    </div>
                                    <span className="text-xs font-black text-gray-500">{(formData.demand * 100).toFixed(0)}%</span>
                                 </div>
                              </div>
                           </div>

                           <p className="text-[9px] text-center text-gray-400 leading-relaxed font-medium">
                              * This model strictly adheres to the **V4 Linear Constraint Engine**.<br />
                              Min floor prevents drops &gt; 15% from your original base price.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

