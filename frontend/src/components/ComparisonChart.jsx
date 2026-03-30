import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { convertPrice, getCurrencySymbol, formatPrice } from "../utils/currency";

export default function ComparisonChart({ yourPrice, competitorPrice }) {
  const data = [
    { 
      name: "Your Price", 
      price: convertPrice(yourPrice), 
      fill: "#3b82f6" 
    },
    { 
      name: "Competitor Price", 
      price: convertPrice(competitorPrice), 
      fill: "#ef4444" 
    }
  ];

 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 text-white p-3 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700">
          <p className="font-semibold text-sm mb-1">{payload[0].payload.name}</p>
          <p className="font-bold text-lg text-blue-400">
            {getCurrencySymbol()}{formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
        📊 Vertical Price Comparison
      </h3>
      
      {}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={120} 
          >
            {}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            
            <XAxis 
              dataKey="name" 
              tick={{fill: '#8b92a5', fontWeight: 600}} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            
            <YAxis 
              tick={{fill: '#8b92a5'}} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${getCurrencySymbol()}${value}`}
            />
            
            {}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{fill: 'rgba(200, 200, 200, 0.1)'}} 
            />
            
            {}
            <Bar 
              dataKey="price" 
              radius={[8, 8, 0, 0]} 
              animationDuration={1500} 
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                 <Cell 
                   key={`cell-${index}`} 
                   fill={entry.fill} 
                   className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                 />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}