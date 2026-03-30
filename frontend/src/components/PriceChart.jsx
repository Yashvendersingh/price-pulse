import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title
);

export default function PriceChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        No price history available 📉
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains("dark");

  const data = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: "Your Price",
        data: history.map((h) => h.price),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Competitor",
        data: history.map((h) => h.competitor),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#d1d5db" : "#374151",
        },
      },
      title: {
        display: true,
        text: "📊 Price Trend Analysis",
        color: isDark ? "#f3f4f6" : "#111827",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: isDark ? "#9ca3af" : "#6b7280" },
        grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
      },
      x: {
        ticks: { color: isDark ? "#9ca3af" : "#6b7280" },
        grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow p-4 border border-gray-100 dark:border-gray-800">
      <Line data={data} options={options} />
    </div>
  );
}