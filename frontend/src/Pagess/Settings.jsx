import { useState, useEffect } from "react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load initial currency from stored preferences
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("currency", currency);
    alert("Settings saved successfully! Updating pricing display...");
    window.location.reload(); // Refresh to globally reflect currency across un-mounted components
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          ⚙️ General Settings
        </h1>

        <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Profile Information</h2>
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                YP
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Display Name</label>
                <input type="text" defaultValue="PricePulse User" className="w-full bg-gray-50 dark:bg-[#1f1f1f] text-gray-800 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Email Address</label>
                <input type="email" defaultValue="user@pricepulse.app" className="w-full bg-gray-50 dark:bg-[#1f1f1f] text-gray-800 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reduce eye strain with a dark dashboard</p>
                </div>
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts when competitor prices change drastically.</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-9' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Currency</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display prices and gaps in your local currency</p>
                </div>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white dark:bg-[#2d2d2d] text-gray-800 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 outline-none"
                >
                  <option value="INR">₹ (INR)</option>
                  <option value="USD">$ (USD)</option>
                  <option value="EUR">€ (EUR)</option>
                  <option value="GBP">£ (GBP)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-[#222222] flex justify-end space-x-4">
            <button className="px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
