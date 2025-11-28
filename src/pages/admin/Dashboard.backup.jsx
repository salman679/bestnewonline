import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import { axiosInstance } from '../../lib/axiosInstanace';
import { FaUsers, FaShoppingCart, FaBox, FaBoxOpen, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    totalRevenue: 0,
    dailyOrders: [],
    topProducts: [],
    salesByStatus: {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    },
    orderTrends: {
      labels: [],
      data: []
    }
  });
 

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          axiosInstance.get('/auth/users'),
          axiosInstance.get('/order'),
          axiosInstance.get('/products')
        ]);

        // Calculate total revenue
        const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.total || 0), 0);

        // Calculate orders by status
        const salesByStatus = ordersRes.data.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        // Calculate daily orders for the last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const dailyOrders = last7Days.map(date => {
          return {
            date,
            count: ordersRes.data.filter(order => 
              new Date(order.createdAt).toISOString().split('T')[0] === date
            ).length
          };
        });

        // Get top selling products
        const productSales = {};
        ordersRes.data.forEach(order => {
          order.items?.forEach(item => {
            productSales[item.productId] = (productSales[item.productId] || 0) + (item.quantity || 1);
          });
        });

        const topProducts = productsRes.data
          .filter(product => productSales[product._id])
          .map(product => ({
            ...product,
            soldCount: productSales[product._id] || 0
          }))
          .sort((a, b) => b.soldCount - a.soldCount)
          .slice(0, 5);

        setStats({
          totalUsers: usersRes.data.length,
          totalOrders: ordersRes.data.length,
          totalProducts: productsRes.data.length,
          recentOrders: ordersRes.data.slice(Math.max(ordersRes.data.length - 5, 0)).reverse(),
          totalRevenue,
          dailyOrders,
          topProducts,
          salesByStatus,
          orderTrends: {
            labels: dailyOrders.map(item => new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })),
            data: dailyOrders.map(item => item.count)
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-[640px]:p-4">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back,{' '}
              <span className="text-blue-600">
                {user?.displayName || 'Admin'}
              </span>
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your store today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <Link
              to="/admin-dashboard/add-product"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaBox className="text-sm" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
               
                {(stats?.totalRevenue || 0).toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                })}
                ৳
              </h3>
              <p className="text-xs text-gray-400 mt-1">Overall earnings</p>
            </div>
            <div className="bg-green-50 p-4 rounded-full">
              <FaMoneyBillWave className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {stats.dailyOrders[6]?.count || 0} today
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-full">
              <FaShoppingCart className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalProducts}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Active listings</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-full">
              <FaBoxOpen className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Registered customers</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-full">
              <FaUsers className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sales Trend</h3>
              <p className="text-sm text-gray-500">
                Last 7 days order activity
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <FaChartLine className="text-blue-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line
              data={{
                labels: stats.orderTrends.labels,
                datasets: [
                  {
                    label: 'Orders',
                    data: stats.orderTrends.data,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-500">Best selling items</p>
            </div>
            <Link
              to="/admin-dashboard/all-products"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image?.[0] || 'placeholder-image-url'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.soldCount} units sold
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {product.price?.toLocaleString()}৳
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Order Status Distribution
            </h3>
            <p className="text-sm text-gray-500">
              Current order status breakdown
            </p>
          </div>
          <Link
            to="/admin-dashboard/orders/management"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Orders
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(stats.salesByStatus).map(([status, count]) => (
            <div key={status} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    status === 'pending'
                      ? 'bg-yellow-400'
                      : status === 'processing'
                      ? 'bg-blue-400'
                      : status === 'completed'
                      ? 'bg-green-400'
                      : 'bg-red-400'
                  }`}
                ></span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {status}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / stats.totalOrders) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table - keep existing table code */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500">Latest 5 orders placed</p>
          </div>
          <Link
            to="/admin-dashboard/orders/management"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerId?.displayName || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total?.toLocaleString()}৳
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <Link
                      to={`/admin-dashboard/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;