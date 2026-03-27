import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// ✅ register all
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title
);

export default function ComparisonChart({ yourPrice, competitorPrice }) {
  const data = {
    labels: ["Your Price", "Competitor Price"],
    datasets: [
      {
        label: "Price Comparison",
        data: [yourPrice, competitorPrice],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderColor: ["#2563eb", "#dc2626"],
        borderWidth: 1,
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
        text: "Price Comparison",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">📊 Price Comparison Chart</h3>
      <Bar data={data} options={options} />
    </div>
  );
}