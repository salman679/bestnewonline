import { FaTimes, FaCopy, FaBox, FaTruck, FaUser, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-hot-toast";

const OrderDetailsModal = ({ order, onClose, onStatusUpdate, statusOptions = [] }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    toast.success('Order ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";
    }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Details
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
              {order?.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Order Summary Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-start gap-2">
                <div className="mt-1"><FaBox className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      #{order._id.slice(-6)}
                    </p>
                    <button
                      onClick={handleCopyOrderId}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      title="Copy Order ID"
                    >
                      {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-start gap-2">
                <div className="mt-1"><FaUser className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {order?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-start gap-2">
                <div className="mt-1"><FaTruck className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {new Date(order?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-gray-400" />
                  Customer Details
                </h3>
                <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{order?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{order?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{order?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                  Shipping Information
                </h3>
                <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{order?.address || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-base text-gray-900 dark:text-white mt-1">{order?.district || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</p>
                      <p className="text-base text-gray-900 dark:text-white mt-1">{order?.postalCode || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{order?.country || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaBox className="w-4 h-4 text-gray-400" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700/50 rounded-lg p-4 flex flex-wrap gap-4 items-center"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {item.name || "N/A"}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.selectedColor && (
                        <span className="flex items-center gap-1">
                          Color: <span className="font-medium">{item.selectedColor}</span>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="flex items-center gap-1">
                          Size: <span className="font-medium">{item.selectedSize}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        Qty: <span className="font-medium">{item.quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per unit</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                      {item.price.toFixed(0)}<span className="text-sm ml-1">৳</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                      {(item.price * item.quantity).toFixed(0)}<span className="text-sm ml-1">৳</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {order.total.toFixed(0)}<span className="text-base ml-1">৳</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {statusOptions.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Update Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onStatusUpdate(order._id, option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${order.status === option.value 
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;