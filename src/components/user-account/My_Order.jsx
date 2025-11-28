import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosInstanace";
import { AuthContext } from "../../context/auth/AuthContext";
import ScrollToTop from "../ScrollToTop";
import OrderDetailsModal from "../../pages/admin/orders/components/OrderDetailsModal";
import { toast } from "react-hot-toast";
import {
  FaCopy,
  FaFilter,
  FaSpinner,
  FaBoxOpen,
  FaShoppingBag,
  FaCalendarAlt,
  FaCreditCard,
  FaChevronRight,
  FaFileInvoice,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useLocalStorage from "../../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const My_Order = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useContext(AuthContext);
  const [orderedData] = useLocalStorage("orderedDataList", []);

  // Remove client-side filtering since we do it server-side now (except for guest orders which are local)
  // But wait, for guest orders 'orderedData', we still need client-side logic if we want to filter them.
  // The prompt focus is on the main "My Orders" which usually means the logged-in user's orders.
  // I will keep `filteredOrders` logic only for guest orders if needed, or just render `orders` directly for user.

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Pass page and filter status to API
        const statusQuery = filter !== "all" ? `&status=${filter}` : "";
        const dateQuery =
          dateRange.start && dateRange.end
            ? `&startDate=${dateRange.start}&endDate=${dateRange.end}`
            : "";
        const response = await axiosInstance(
          `/order/user/${user?.uid}?page=${pagination.currentPage}&limit=10${statusQuery}${dateQuery}`
        );

        if (response.data.orders) {
          setOrders(response.data.orders);
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage, // Ensure sync
            totalOrders: response.data.totalOrders,
          }));
        } else {
          // Fallback for old API structure if any
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("অর্ডার লোড করতে ব্যর্থ হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, pagination.currentPage, filter, dateRange]); // Re-fetch when page or filter changes

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancelOrder = async (orderId) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এটি পুনরায় ফিরিয়ে আনতে পারবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "হ্যাঁ, বাতিল করুন!",
      cancelButtonText: "না",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/order/update/${orderId}`, {
            status: "cancelled from user",
          });
          setOrders(
            orders.map((order) =>
              order._id === orderId
                ? { ...order, status: "cancelled from user" }
                : order
            )
          );
          Swal.fire("বাতিল!", "আপনার অর্ডার বাতিল করা হয়েছে।", "success");
        } catch (error) {
          console.error("Error cancelling order:", error);
          toast.error("অর্ডার বাতিল করতে ব্যর্থ হয়েছে");
        }
      }
    });
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success("অর্ডার আইডি কপি করা হয়েছে!");
  };

  const handleInvoiceDownload = (orderId) => {
    toast.success("ইনভয়েস ডাউনলোড শীঘ্রই শুরু হবে!");
    // Implement actual invoice logic here
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Pending
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200"; // Confirmed
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-orange-100 text-orange-700 border-orange-200"; // On Delivery
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"; // Delivered
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
      case "cancelled from user":
        return "bg-red-100 text-red-700 border-red-200"; // Cancelled
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "পেন্ডিং";
      case "processing":
        return "কনফার্মড";
      case "confirmed":
        return "কনফার্মড";
      case "shipped":
        return "অন ডেলিভারি";
      case "completed":
        return "ডেলিভারড";
      case "delivered":
        return "ডেলিভারড";
      case "cancelled":
        return "বাতিল";
      case "cancelled from user":
        return "বাতিল (আপনি)";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString("bn-BD");
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12 font-sans font-hind-siliguri">
      <ScrollToTop />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-bangla">
              আমার অর্ডার
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-bangla">
              আপনার পূর্ববর্তী অর্ডারের তালিকা এবং বিস্তারিত
            </p>
          </div>

          {/* Filters */}
          {orders.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Range */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="bg-transparent text-xs font-bangla text-gray-600 dark:text-gray-300 outline-none px-2"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="bg-transparent text-xs font-bangla text-gray-600 dark:text-gray-300 outline-none px-2"
                />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[180px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400 w-3 h-3" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer font-bangla"
                >
                  <option value="all">সকল অর্ডার</option>
                  <option value="pending">পেন্ডিং</option>
                  <option value="processing">কনফার্মড</option>
                  <option value="shipped">অন ডেলিভারি</option>
                  <option value="completed">ডেলিভারড</option>
                  <option value="cancelled">বাতিল</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Logged In User Orders */}
        {user && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <FaSpinner className="animate-spin w-8 h-8 text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBoxOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-bangla">
                  কোনো অর্ডার পাওয়া যায়নি
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto font-bangla">
                  মনে হচ্ছে আপনি এখনও কোনো অর্ডার করেননি অথবা আপনার ফিল্টারের
                  সাথে কোনো অর্ডার মিলছে না।
                </p>
                <Link
                  to="/product-category"
                  className="btn-minimal btn-primary inline-flex font-bangla"
                >
                  কেনাকাটা শুরু করুন
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium font-bangla">
                              অর্ডার আইডি
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleCopyOrderId(order._id)}
                              className="text-gray-400 hover:text-primary transition-colors"
                              title="কপি করুন"
                            >
                              <FaCopy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <FaCalendarAlt className="w-3.5 h-3.5" />
                            <span className="font-bangla">
                              {formatDate(order.orderDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleInvoiceDownload(order._id)}
                            className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-primary transition-colors font-bangla"
                          >
                            <FaFileInvoice className="w-3.5 h-3.5" />
                            ইনভয়েস
                          </button>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border font-bangla ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-bangla">
                                মোট পরিমাণ
                              </span>
                              <span className="text-xl font-bold text-gray-900 dark:text-white font-bangla">
                                {formatPrice(order.total)}৳
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1 font-bangla">
                                <FaCreditCard className="w-3 h-3" />
                                {order.paymentMethod === "cod"
                                  ? "ক্যাশ অন ডেলিভারি"
                                  : order.paymentMethod}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {order.status === "pending" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors border border-red-100 dark:border-red-900/30 font-bangla"
                              >
                                বাতিল করুন
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="btn-minimal btn-outline px-5 py-2 rounded-xl text-sm flex items-center gap-2 font-bangla"
                            >
                              বিস্তারিত দেখুন
                              <FaChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 font-bangla text-sm"
                    >
                      পূর্ববর্তী
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      পৃষ্ঠা {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 font-bangla text-sm"
                    >
                      পরবর্তী
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Guest Orders */}
        {!user && orderedData.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-bangla">
              গেস্ট অর্ডারসমূহ
            </h2>
            <div className="grid gap-6">
              {[...orderedData].reverse().map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-bangla">
                        অর্ডার আইডি:
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        #{order.orderId}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary font-bangla">
                      {formatPrice(order.total)}৳
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {order.items?.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 font-bangla">
                          {order.items?.length} টি পণ্য •{" "}
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            handleCopyOrderId={handleCopyOrderId}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default My_Order;
