// components/PriceChart.jsx

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
      <div className="text-center text-gray-500 py-10">
        No price history available 📉
      </div>
    );
  }

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
      },
      title: {
        display: true,
        text: "📊 Price Trend Analysis",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <Line data={data} options={options} />
    </div>
  );
}