import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaTimesCircle,
  FaTruck,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axiosInstanace";
import OrderStatusBadge from "./components/OrderStatusBadge";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sendingOrders, setSendingOrders] = useState([]);
  const [courierOrders, setCourierOrders] = useState({});

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "processing", label: "Processing", color: "blue" },
    { value: "shipped", label: "Shipped", color: "indigo" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
    { value: "refunded", label: "Refunded", color: "purple" },
  ];

  // Fetch orders
  useEffect(() => {
    fetchOrders();
    fetchCourierOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance("/order");
      setOrders(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourierOrders = async () => {
    try {
      const response = await axiosInstance.get("/steadfast/courier-orders");
      if (response.data.success) {
        const courierMap = {};
        response.data.data.forEach((courier) => {
          if (courier.orderId) {
            courierMap[courier.orderId] = courier;
          }
        });
        setCourierOrders(courierMap);
      }
    } catch (error) {
      console.error("Failed to fetch courier orders", error);
    }
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success("Order ID copied to clipboard!");
  };

  // Toggle order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders on current page
  const handleSelectAll = () => {
    const currentOrderIds = currentOrders.map((order) => order._id);
    if (selectedOrders.length === currentOrderIds.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrderIds);
    }
  };

  // Send single order to Steadfast
  const handleSendToCourier = async (order) => {
    try {
      setSendingOrders((prev) => [...prev, order._id]);

      const courierData = {
        orderId: order._id,
        invoice: order._id.slice(-8).toUpperCase(),
        recipient_name: order.name,
        recipient_phone: order.phone,
        recipient_address: order.address,
        cod_amount: order.total,
      };

      const response = await axiosInstance.post(
        "/steadfast/create-order",
        courierData
      );

      if (response.data.success) {
        toast.success("কুরিয়ার অর্ডার সফলভাবে তৈরি হয়েছে!");
        await fetchCourierOrders();
      } else {
        toast.error(
          response.data.message || "কুরিয়ার অর্ডার তৈরি করতে ব্যর্থ"
        );
      }
    } catch (error) {
      console.error("Send to courier error:", error);
      toast.error(
        error.response?.data?.message || "কুরিয়ার অর্ডার তৈরি করতে ব্যর্থ"
      );
    } finally {
      setSendingOrders((prev) => prev.filter((id) => id !== order._id));
    }
  };

  // Send multiple orders to Steadfast
  const handleSendAllToCourier = async () => {
    if (selectedOrders.length === 0) {
      toast.error("কোনো অর্ডার নির্বাচন করা হয়নি");
      return;
    }

    try {
      setSendingOrders((prev) => [...prev, ...selectedOrders]);

      const ordersToSend = orders.filter((order) =>
        selectedOrders.includes(order._id)
      );
      const courierDataArray = ordersToSend.map((order) => ({
        orderId: order._id,
        invoice: order._id.slice(-8).toUpperCase(),
        recipient_name: order.name,
        recipient_phone: order.phone,
        recipient_address: order.address,
        cod_amount: order.total,
      }));

      const response = await axiosInstance.post("/steadfast/bulk-order", {
        orders: courierDataArray,
      });

      if (response.data.success) {
        toast.success(
          `${selectedOrders.length}টি কুরিয়ার অর্ডার সফলভাবে তৈরি হয়েছে!`
        );
        setSelectedOrders([]);
        await fetchCourierOrders();
      } else {
        toast.error(response.data.message || "বাল্ক অর্ডার তৈরি করতে ব্যর্থ");
      }
    } catch (error) {
      console.error("Bulk send error:", error);
      toast.error(
        error.response?.data?.message || "বাল্ক অর্ডার তৈরি করতে ব্যর্থ"
      );
    } finally {
      setSendingOrders((prev) =>
        prev.filter((id) => !selectedOrders.includes(id))
      );
    }
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Optimistically update the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Make the API call
      await axiosInstance.patch(`/order/update/${orderId}`, {
        status: newStatus,
      });

      toast.success("Order status updated successfully! 🎉");
    } catch (error) {
      // Revert the optimistic update on error
      fetchOrders(); // Re-fetch to ensure sync
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  // Handle order deletion
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "⚠️আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি মুছতে চান? এই ক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না।",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/order/delete/${id}`);
          setOrders(orders.filter((order) => order._id !== id));

          toast.success("অর্ডার সফলভাবে মুছে ফেলা হয়েছে! 🎉");
        } catch (error) {
          toast.error("Failed to delete order");
          console.error(error);
        }
      }
    });
  };

  // Filter and sort orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order?._id || "").includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || order?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      case "oldest":
        return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      case "highest":
        return (b?.total || 0) - (a?.total || 0);
      case "lowest":
        return (a?.total || 0) - (b?.total || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  // Calculate Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your store orders
          </p>
        </div>
        {selectedOrders.length > 0 && (
          <button
            onClick={handleSendAllToCourier}
            disabled={sendingOrders.length > 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
          >
            <FaTruck className="w-4 h-4" />
            Send All ({selectedOrders.length})
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Orders"
          value={stats.total}
          icon={FaBox}
          color="bg-blue-500"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={FaClock}
          color="bg-yellow-500"
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          icon={FaShippingFast}
          color="bg-indigo-500"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={FaCheckCircle}
          color="bg-green-500"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          icon={FaTimesCircle}
          color="bg-red-500"
        />
      </div>

      {/* Filters & Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 shadow-sm md:flex-row rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
          <FaSearch className="absolute text-sm text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-sm min-w-[140px]"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-sm min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">
                  <button
                    onClick={handleSelectAll}
                    className="hover:text-[#016737]"
                  >
                    {selectedOrders.length === currentOrders.length &&
                    currentOrders.length > 0 ? (
                      <FaCheckSquare className="w-5 h-5" />
                    ) : (
                      <FaSquare className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Total</th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Courier
                </th>
                <th className="px-6 py-3 font-semibold text-right text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => {
                  const courierOrder = courierOrders[order._id];
                  const isSending = sendingOrders.includes(order._id);
                  const isSelected = selectedOrders.includes(order._id);

                  return (
                    <tr
                      key={order._id}
                      className={`transition-colors hover:bg-gray-50/50 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleSelectOrder(order._id)}
                          className="hover:text-[#016737]"
                        >
                          {isSelected ? (
                            <FaCheckSquare className="w-5 h-5 text-[#016737]" />
                          ) : (
                            <FaSquare className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        <button
                          onClick={() => handleCopyOrderId(order._id)}
                          className="flex items-center gap-2 transition-colors hover:text-primary"
                          title="Copy ID"
                        >
                          #{order._id.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {order.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.phone || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ৳{order.total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        {courierOrder ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              <FaTruck className="w-3 h-3 mr-1" />
                              {courierOrder.status === "delivered"
                                ? "Delivered"
                                : courierOrder.status === "in_transit"
                                ? "In Transit"
                                : courierOrder.status === "pending"
                                ? "Pending"
                                : courierOrder.status}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendToCourier(order)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#016737] rounded-lg hover:bg-[#034425] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSending ? (
                              <>
                                <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <FaTruck className="w-3 h-3" />
                                <span>Send</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <Link
                            to={`/admin-dashboard/orders/details/${order._id}`}
                            className="flex items-center gap-2 text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaEye className="w-4 h-4" />
                            <span className="text-sm">View Details</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="flex items-center gap-2 text-red-600 transition-colors duration-200 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FaTrash className="w-4 h-4" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, sortedOrders.length)} of{" "}
              {sortedOrders.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === i + 1
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:bg-gray-100 bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center justify-between p-4 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
    <div>
      <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div
      className={`p-3 rounded-full text-white ${color} bg-opacity-90 shadow-sm`}
    >
      <Icon size={16} />
    </div>
  </div>
);

export default OrderManagement;
