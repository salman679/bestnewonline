import { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axiosInstanace";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const SiteAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    salesData: [],
    userGrowth: []
  });




  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          axiosInstance("/auth/users"),
          axiosInstance("/order"),
          axiosInstance("/products")
        ]);

        // Calculate statistics
        const totalUsers = usersRes.data.length;
        const totalOrders = ordersRes.data.length;
        const totalProducts = productsRes.data.length;
        const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);

        // Get recent orders
        const recentOrders = ordersRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Get top products
        const topProducts = productsRes.data
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);

        // Generate sales data for the last 7 days
        const salesData = generateSalesData(ordersRes.data);

        // Generate user growth data for the last 7 days
        const userGrowth = generateUserGrowthData(usersRes.data);

        setStats({
          totalUsers,
          totalOrders,
          totalProducts,
          totalRevenue,
          recentOrders,
          topProducts,
          salesData,
          userGrowth
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to fetch analytics data");
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);



  // Generate sales data for the last 7 days
  const generateSalesData = (orders) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(order =>
        order.createdAt.split('T')[0] === date
      );
      return {
        date,
        sales: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      };
    });
  };

  // Generate user growth data for the last 7 days
  const generateUserGrowthData = (users) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayUsers = users.filter(user =>
        user.createdAt.split('T')[0] === date
      );
      return {
        date,
        users: dayUsers.length
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="textColor600 dark:textColor">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-[640px]:p-2">
      <h1 className="text-3xl max-[640px]:text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <FaUsers className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <FaShoppingCart className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <FaBox className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>


      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.total}<span className="text-2xl font-bold">৳</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {product.image && product.image[0] && (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.price.toFixed(0)}<span className="text-2xl font-bold">৳</span>
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {product.sold} sold
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales Trend
          </h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full">
              {stats.salesData.map((data, index) => (
                <div
                  key={data.date}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(data.date).toLocaleDateString()}
                  </div>
                  <div className="flex-1">
                    <div
                      className="bg-blue-500 h-6 rounded"
                      style={{ width: `${(data.sales / Math.max(...stats.salesData.map(d => d.sales))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 dark:text-white text-right">
                    {data.sales.toFixed(0)}<span className="text-2xl font-bold">৳</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full">
              {stats.userGrowth.map((data, index) => (
                <div
                  key={data.date}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(data.date).toLocaleDateString()}
                  </div>
                  <div className="flex-1">
                    <div
                      className="bg-green-500 h-6 rounded"
                      style={{ width: `${(data.users / Math.max(...stats.userGrowth.map(d => d.users))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 dark:text-white text-right">
                    {data.users} users
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteAnalytics; 