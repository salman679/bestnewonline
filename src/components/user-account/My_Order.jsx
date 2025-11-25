import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosInstanace";
import { AuthContext } from "../../context/auth/AuthContext";
import ScrollToTop from "../ScrollToTop";
import OrderDetailsModal from "../../pages/admin/orders/components/OrderDetailsModal";
import { toast } from "react-hot-toast";
import { FaCopy, FaSearch, FaFilter, FaSpinner, FaBox, FaShoppingBag, FaCalendar, FaMoneyBill } from "react-icons/fa";
import Swal from 'sweetalert2';
import useLocalStorage from "../../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

const My_Order = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useContext(AuthContext);
  const [orderedData, setOrderedData] = useLocalStorage('orderedDataList', []);

  

  const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status === filter);;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          const response = await axiosInstance(`/order/user/${user?.uid}`);
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.uid, user]);

  const handleCancelOrder = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/order/update/${orderId}`, { status: 'cancelled from user' });
          setOrders(orders.map(order =>
            order._id === orderId ? { ...order, status: 'cancelled from user' } : order
          ));
          Swal.fire({
            title: "Cancelled !",
            text: "Your order has been cancelled.",
            icon: "success"
          });
        } catch (error) {
          console.error('Error cancelling order:', error);
          toast.error('Failed to cancel order');
        }
      }
    });
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'cancelled from user', label: 'Cancelled by You', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'purple' }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'cancelled from user':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'cancelled from user':
        return 'Cancelled by You';
      case 'cancelled':
        return 'Cancelled by Admin';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()}৳`;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 dark:from-gray-900 dark:to-gray-800 md:py-16">
      <ScrollToTop />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 border dark:border-gray-700">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                <FaShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage your orders</p>
              </div>
            </div>

            {/* Search and Filter Controls */}
            {orders.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Orders</option>
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Sections */}
        <div className="space-y-8">
          {/* Account Orders */}

          {user && 
            (
              orders.length > 0 && <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-6 flex max-[640px]:text-lg text-nowrap items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                  <FaBox className="textColor" />
                  Orders with Account
                </h2>
    
                <AnimatePresence>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex min-h-[200px] items-center justify-center"
                    >
                      <div className="flex items-center gap-3">
                        <FaSpinner className="h-6 w-6 animate-spin textColor" />
                        <span className="text-gray-600 dark:text-gray-400">Loading orders...</span>
                      </div>
                    </motion.div>
                  ) : filteredOrders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex min-h-[200px] flex-col items-center justify-center"
                    >
                      <img
                        src="https://www.svgrepo.com/show/507080/empty-box.svg"
                        alt="No orders"
                        className="mb-4 h-24 w-24 opacity-50"
                      />
                      <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {[...filteredOrders].reverse().map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-orange-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:dark:border-orange-500/30"
                        >
                          <div className="p-6">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                              {/* Order ID */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</span>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {order._id.slice(0, 8)}...
                                  </span>
                                  <button
                                    onClick={() => handleCopyOrderId(order._id)}
                                    className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-500 dark:text-gray-500 dark:hover:bg-gray-700"
                                  >
                                    <FaCopy className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
    
                              {/* Date */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</span>
                                <div className="mt-2 flex items-center gap-2">
                                  <FaCalendar className="h-4 w-4 text-orange-500" />
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
    
                              {/* Total */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
                                <div className="mt-2 flex items-center gap-2">
                                  <FaMoneyBill className="h-4 w-4 text-orange-500" />
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>
    
                              {/* Status */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                                <div className="mt-2">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${getStatusStyle(order.status)}`}>
                                    {formatStatus(order.status)}
                                  </span>
                                </div>
                              </div>
    
                              {/* Actions */}
                              <div className="flex items-end justify-end gap-3">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="rounded-lg border-2 border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              )  
          }
          


          {/* Orders without Account */}
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 border dark:border-gray-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                <FaShoppingBag className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders without Account</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your guest orders here</p>
              </div>
            </div>

            <AnimatePresence>
              {orderedData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
                >
                  <img
                    src="https://www.svgrepo.com/show/507080/empty-box.svg"
                    alt="No orders"
                    className="mb-4 h-24 w-24 opacity-50"
                  />
                  <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {[...orderedData].reverse().map((order) => (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-orange-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:dark:border-orange-500/30"
                    >
                      {/* Order Header */}
                      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                              <FaBox className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  অর্ডার আইডি: #{order.orderId}
                                </h3>
                                <button
                                  onClick={() => handleCopyOrderId(order.orderId)}
                                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-orange-500 dark:hover:bg-gray-700"
                                >
                                  <FaCopy className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                তারিখ: {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-semibold text-orange-500">
                              মোট: {formatPrice(order.total)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              পেমেন্ট: {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {order.items?.map((item) => (
                          <div
                            key={item.productId}
                            className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-32 w-32 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                            />
                            <div className="flex flex-1 flex-col">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {item.name}
                              </h4>
                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700">📏</span>
                                  <span className="text-gray-600 dark:text-gray-300">সাইজ: {item.selectedSize}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700">🎨</span>
                                  <span className="text-gray-600 dark:text-gray-300">কালার: {item.selectedColor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700">🔢</span>
                                  <span className="text-gray-600 dark:text-gray-300">পরিমাণ: {item.quantity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-700">💰</span>
                                  <span className="text-gray-600 dark:text-gray-300">দাম: {formatPrice(item.price)}</span>
                                </div>
                              </div>
                              {item.discount > 0 && (
                                <div className="mt-4">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    🎉 {item.discount}% ছাড়!
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            handleCopyOrderId={handleCopyOrderId}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={() => { }}
            className="mt-7"
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default My_Order;
