import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../../lib/axiosInstanace';
import OrderStatusBadge from './components/OrderStatusBadge';
import OrderEditModal from './components/OrderEditModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Swal from 'sweetalert2'
const OrderManagement = () => {
  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'purple' }
  ];

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance('/order');
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Optimistically update the UI
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Also update the selected order if it's being viewed in the modal
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus
        }));
      }

      // Make the API call
      await axiosInstance.patch(`/order/update/${orderId}`, { status: newStatus });

      toast.success('অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে! 🎉');
    } catch (error) {
      // Revert the optimistic update on error
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: selectedOrder.status }
            : order
        )
      );

      // Revert selected order status if in modal
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: prev.status
        }));
      }

      toast.error('Failed to update order status');
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
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          await axiosInstance.delete(`/order/delete/${id}`);
          setOrders(orders.filter(order => order._id !== id));

          toast.success('অর্ডার সফলভাবে মুছে ফেলা হয়েছে! 🎉');
        } catch (error) {
          toast.error('Failed to delete order');
          console.error(error);
        }

      }
    });
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (
      (order?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order?._id || '').includes(searchTerm)
    );
    const matchesStatus = filterStatus === 'all' || order?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      case 'oldest':
        return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      case 'highest':
        return (b?.total || 0) - (a?.total || 0);
      case 'lowest':
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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-[640px]:p-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl max-[640px]:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Order Management
            <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full">
              {orders.length} Orders
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage all customer orders efficiently
          </p>
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Orders Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {orders.length}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FaSort className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Orders
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {orders.filter(order => order.status === 'pending').length}
              </h3>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <span className="block w-6 h-6 text-yellow-600 dark:text-yellow-400">
                ⏳
              </span>
            </div>
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Processing
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {orders.filter(order => order.status === 'processing').length}
              </h3>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
              <span className="block w-6 h-6 text-indigo-600 dark:text-indigo-400">
                🔄
              </span>
            </div>
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Shipped
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {orders.filter(order => order.status === 'shipped').length}
              </h3>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
              <span className="block w-6 h-6 text-indigo-600 dark:text-indigo-400">
                🚚
              </span>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {orders.filter(order => order.status === 'completed').length}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <span className="block w-6 h-6 text-green-600 dark:text-green-400">
                ✅
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex gap-4 flex-wrap md:flex-nowrap">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[140px] transition-all duration-200"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[140px] transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-[640px]:p-0">
            {currentOrders.map(order => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 relative group"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Order ID
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order?._id?.substring(0, 8)}...
                        </span>
                        <button
                          onClick={() => handleCopyOrderId(order._id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Copy Order ID"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <OrderStatusBadge status={order?.status || 'pending'} />
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Customer
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order?.name || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Date
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {order?.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Total
                      </span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {(order?.total || 0).toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                        <span className="text-sm ml-1">৳</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <FaEye className="w-4 h-4" />
                      <span className="text-sm">View Details</span>
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <FaTrash className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, sortedOrders.length)}
              </span>{' '}
              of <span className="font-medium">{sortedOrders.length}</span>{' '}
              orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(totalPages, 3))].map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage === 1) {
                    pageNumber = index + 1;
                  } else if (currentPage === totalPages) {
                    pageNumber = totalPages - 2 + index;
                  } else {
                    pageNumber = currentPage - 1 + index;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        currentPage === pageNumber
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          handleCopyOrderId={handleCopyOrderId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null); // Clear selected order when closing modal
          }}
          onStatusUpdate={handleStatusUpdate}
          statusOptions={statusOptions}
        />
      )}
    </div>
  );
};

export default OrderManagement;