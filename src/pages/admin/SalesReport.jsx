import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axiosInstanace';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FaChartLine,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const SalesReport = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    salesByMonth: [],
    topProducts: [],
    recentOrders: [],
  });
  const [dateRange, setDateRange] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalesData();
  }, [dateRange, selectedYear]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/sales-report?range=${dateRange}&year=${selectedYear}`);
      setSalesData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to fetch sales data');
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    toast.success('Report exported successfully');
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sales Report</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and analyze your sales performance</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {salesData.totalSales.toLocaleString()}<span className="text-2xl font-bold">৳</span>
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <FaDollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${calculateGrowth(salesData.totalSales, salesData.previousTotalSales) >= 0 ? 'text-green-500' : 'textColor'}`}>
              {calculateGrowth(salesData.totalSales, salesData.previousTotalSales) >= 0 ? (
                <FaArrowUp className="w-4 h-4 inline" />
              ) : (
                <FaArrowDown className="w-4 h-4 inline" />
              )}
              {Math.abs(calculateGrowth(salesData.totalSales, salesData.previousTotalSales)).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {salesData.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <FaShoppingCart className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${calculateGrowth(salesData.totalOrders, salesData.previousTotalOrders) >= 0 ? 'text-green-500' : 'textColor'}`}>
              {calculateGrowth(salesData.totalOrders, salesData.previousTotalOrders) >= 0 ? (
                <FaArrowUp className="w-4 h-4 inline" />
              ) : (
                <FaArrowDown className="w-4 h-4 inline" />
              )}
              {Math.abs(calculateGrowth(salesData.totalOrders, salesData.previousTotalOrders)).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {salesData.averageOrderValue.toLocaleString()}<span className="text-2xl font-bold">৳</span>
              </h3>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <FaChartLine className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${calculateGrowth(salesData.averageOrderValue, salesData.previousAverageOrderValue) >= 0 ? 'text-green-500' : 'textColor'}`}>
              {calculateGrowth(salesData.averageOrderValue, salesData.previousAverageOrderValue) >= 0 ? (
                <FaArrowUp className="w-4 h-4 inline" />
              ) : (
                <FaArrowDown className="w-4 h-4 inline" />
              )}
              {Math.abs(calculateGrowth(salesData.averageOrderValue, salesData.previousAverageOrderValue)).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {salesData.totalCustomers.toLocaleString()}
              </h3>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <FaUsers className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${calculateGrowth(salesData.totalCustomers, salesData.previousTotalCustomers) >= 0 ? 'text-green-500' : 'textColor'}`}>
              {calculateGrowth(salesData.totalCustomers, salesData.previousTotalCustomers) >= 0 ? (
                <FaArrowUp className="w-4 h-4 inline" />
              ) : (
                <FaArrowDown className="w-4 h-4 inline" />
              )}
              {Math.abs(calculateGrowth(salesData.totalCustomers, salesData.previousTotalCustomers)).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" className="dark:text-gray-400" />
                <YAxis className="dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.topProducts}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" className="dark:text-gray-400" />
                <YAxis className="dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {salesData.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.total.toLocaleString()}<span className="text-2xl font-bold">৳</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesReport; 