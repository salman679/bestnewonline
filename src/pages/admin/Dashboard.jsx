import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { axiosInstance } from "../../lib/axiosInstanace";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaMoneyBillWave,
  FaPlus,
  FaClipboardList,
  FaTags,
} from "react-icons/fa";
import StatsCard from "../../components/Admin-Dashboard/overview/StatsCard";
import SalesChart from "../../components/Admin-Dashboard/overview/SalesChart";
import TopProducts from "../../components/Admin-Dashboard/overview/TopProducts";
import RecentOrdersTable from "../../components/Admin-Dashboard/overview/RecentOrdersTable";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    totalRevenue: 0,
    chartData: [],
    topProducts: [],
    salesByStatus: {},
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          axiosInstance.get("/auth/users"),
          axiosInstance.get("/order"),
          axiosInstance.get("/products"),
        ]);

        // Calculate total revenue
        const totalRevenue = ordersRes.data.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        // Calculate orders by status
        const salesByStatus = ordersRes.data.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        // Calculate daily orders for the last 7 days (Chart Data)
        const last7Days = [...Array(7)]
          .map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split("T")[0];
          })
          .reverse();

        const chartData = last7Days.map((date) => {
          const daysOrders = ordersRes.data.filter(
            (order) =>
              new Date(order.createdAt).toISOString().split("T")[0] === date
          );

          const dailySales = daysOrders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
          );

          return {
            name: new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            orders: daysOrders.length,
            sales: dailySales,
          };
        });

        // Get top selling products
        const productSales = {};
        ordersRes.data.forEach((order) => {
          order.items?.forEach((item) => {
            productSales[item.productId] =
              (productSales[item.productId] || 0) + (item.quantity || 1);
          });
        });

        const topProducts = productsRes.data
          .filter((product) => productSales[product._id])
          .map((product) => ({
            ...product,
            soldCount: productSales[product._id] || 0,
          }))
          .sort((a, b) => b.soldCount - a.soldCount)
          .slice(0, 5);

        setStats({
          totalUsers: usersRes.data.length,
          totalOrders: ordersRes.data.length,
          totalProducts: productsRes.data.length,
          recentOrders: ordersRes.data
            .slice(Math.max(ordersRes.data.length - 5, 0))
            .reverse(),
          totalRevenue,
          chartData,
          topProducts,
          salesByStatus,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016737]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-500">
              Welcome back,{" "}
              <span className="font-semibold text-[#016737]">
                {user?.displayName || user?.Database?.fullName || "Admin"}
              </span>
              ! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin-dashboard/add-product"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-colors shadow-sm font-medium text-sm"
          >
            <FaPlus className="w-4 h-4" />
            Add Product
          </Link>
          <Link
            to="/admin-dashboard/orders/management"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <FaClipboardList className="w-4 h-4" />
            View Orders
          </Link>
          <Link
            to="/admin-dashboard/add-category"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <FaTags className="w-4 h-4" />
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()}৳`}
          icon={FaMoneyBillWave}
          color="green"
          trend="up"
          trendValue="12.5%"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="blue"
          trend="up"
          trendValue="8.2%"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FaBox}
          color="purple"
          trend="down"
          trendValue="1.2%"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={FaUsers}
          color="orange"
          trend="up"
          trendValue="5.3%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Charts & Tables */}
        <div className="space-y-6 lg:col-span-2">
          {/* Sales Chart */}
          <SalesChart data={stats.chartData} />

          {/* Recent Orders */}
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>

        {/* Right Column - Top Products & Widgets */}
        <div className="space-y-6">
          <TopProducts products={stats.topProducts} />

          {/* Optional: Add another widget here, e.g., Marketing Banners or System Health */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
