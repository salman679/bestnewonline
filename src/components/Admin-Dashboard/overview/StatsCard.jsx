import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="p-6 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(trend || trendValue) && (
        <div className="flex items-center gap-2 mt-4 text-sm">
          <span
            className={`flex items-center font-medium ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <FaArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <FaArrowDown className="w-3 h-3 mr-1" />
            )}
            {trendValue}
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
