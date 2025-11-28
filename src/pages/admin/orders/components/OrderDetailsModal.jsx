import { useContext, useState } from "react";
import {
  FaTimes,
  FaTruck,
  FaBox,
  FaUser,
  FaCreditCard,
  FaMapMarkerAlt,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";
import OrderStatusBadge from "./OrderStatusBadge";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { toast } from "react-hot-toast";

const OrderDetailsModal = ({
  order,
  onClose,
  onStatusUpdate,
  statusOptions,
  className,
}) => {
  const [copiedField, setCopiedField] = useState("");

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { user } = useContext(AuthContext);
  const isAdmin = user?.Database?.role === "admin";

  const formatPrice = (price) => {
    // Ensure price is a number
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "0 ৳";
    return `${numericPrice.toLocaleString()}৳`;
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(""), 2000);
  };

  if (!order) return null;

  const calculateSubtotal = () => {
    return (
      order.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ||
      0
    );
  };

  let shippingCharge = 120; // Default shipping charge

  // Update shipping charge based on district
  if (order.district === "Dhaka") {
    shippingCharge = 60;
  } else if (order.district === "Outside Dhaka") {
    shippingCharge = 120;
  }

  // Calculate total including shipping
  const total = calculateSubtotal() + shippingCharge;

  return (
    <div className="fixed inset-0 bg-[#00000062] flex items-center justify-center z-50 overflow-hidden">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg w-full h-[90vh] max-w-4xl mx-auto my-2 sm:my-8 shadow-xl ${className} flex flex-col`}
      >
        {/* Header - Made sticky with higher z-index */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex justify-between items-center p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBox className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2"
            >
              <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content - Made scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {/* Order Header with enhanced design */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white break-all">
                    Order #{order._id}
                  </h3>
                  <button
                    onClick={() => handleCopy(order._id, "Order ID")}
                    className="p-1.5 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition-colors duration-200 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700"
                    title="Copy Order ID"
                  >
                    {copiedField === "Order ID" ? (
                      <FaCheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <FaCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <OrderStatusBadge
                  status={
                    order.status === "cancelled from user" && !isAdmin
                      ? "cancelled by You"
                      : order.status || "pending"
                  }
                />
              </div>
            </div>
          </div>

          {/* Order tracking section */}
          <div className="w-full mb-4 sm:mb-6">
            <div className="w-full flex-col justify-start items-start gap-4 sm:gap-8 inline-flex">
              <div className="w-full p-4 sm:p-8 bg-white rounded-xl flex-col justify-start items-start gap-3 sm:gap-5 flex">
                <h2 className="w-full text-gray-900 text-xl sm:text-2xl font-semibold font-manrope leading-9 pb-3 sm:pb-5 border-b border-gray-200">
                  Order Tracking
                </h2>
                <div className="w-full flex-col justify-center items-center">
                  <ol className="flex flex-col sm:flex-row items-start justify-between w-full gap-4 sm:gap-1">
                    <li
                      className={`group flex relative justify-start  ${
                        order.status === "pending" ||
                        order.status === "processing" ||
                        order.status === "shipped" ||
                        order.status === "completed"
                          ? "after:bg-green-600"
                          : "after:bg-gray-500"
                      } after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-36`}
                    >
                      <div className="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                        <div className="justify-center items-center gap-1.5 inline-flex">
                          <h5
                            className={`text-center ${
                              order.status === "pending" ||
                              order.status === "processing" ||
                              order.status === "shipped" ||
                              order.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                            } text-lg font-medium leading-normal`}
                          >
                            Order Placed
                          </h5>
                          {(order.status === "pending" ||
                            order.status === "processing" ||
                            order.status === "shipped" ||
                            order.status === "completed") && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                fill="#047857"
                              />
                            </svg>
                          )}
                        </div>
                        <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                          {formatDate(order.createdAt)}
                        </h6>
                      </div>
                    </li>

                    <li
                      className={`group flex relative justify-start  ${
                        order.status === "processing" ||
                        order.status === "shipped" ||
                        order.status === "completed"
                          ? "after:bg-green-600"
                          : "after:bg-gray-500"
                      } after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-32`}
                    >
                      <div className="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                        <div className="justify-center items-center gap-1.5 inline-flex">
                          <h5
                            className={`text-center ${
                              order.status === "processing" ||
                              order.status === "shipped" ||
                              order.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                            } text-lg font-medium leading-normal`}
                          >
                            Order Processing
                          </h5>
                          {(order.status === "processing" ||
                            order.status === "shipped" ||
                            order.status === "completed") && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                fill="#047857"
                              />
                            </svg>
                          )}
                        </div>
                        <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                          {order.status === "processing"
                            ? formatDate(order.updatedAt)
                            : "-"}
                        </h6>
                      </div>
                    </li>

                    <li
                      className={`group flex relative justify-start  ${
                        order.status === "shipped" ||
                        order.status === "completed"
                          ? "after:bg-green-600"
                          : "after:bg-gray-500"
                      } after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-32`}
                    >
                      <div className="w-full mr-1 z-10 flex flex-col items-center justify-start gap-1">
                        <div className="justify-center items-center gap-1.5 inline-flex">
                          <h5
                            className={`text-center ${
                              order.status === "shipped" ||
                              order.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                            } text-lg font-medium leading-normal`}
                          >
                            Order Shipped
                          </h5>
                          {(order.status === "shipped" ||
                            order.status === "completed") && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                fill="#047857"
                              />
                            </svg>
                          )}
                        </div>
                        <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                          {order.status === "shipped"
                            ? formatDate(order.updatedAt)
                            : "-"}
                        </h6>
                      </div>
                    </li>

                    <li className="group flex relative justify-start">
                      <div className="w-full z-10 flex flex-col items-center justify-start gap-1">
                        <div className="justify-center items-center gap-1.5 inline-flex">
                          <h5
                            className={`text-center ${
                              order.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                            } text-lg font-medium leading-normal`}
                          >
                            Order Delivered
                          </h5>
                          {order.status === "completed" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                fill="#047857"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                fill="#047857"
                              />
                            </svg>
                          )}
                        </div>
                        <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                          {order.status === "completed"
                            ? formatDate(order.updatedAt)
                            : "-"}
                        </h6>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBox className="text-orange-500" />
                  Order Items
                </h4>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items?.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <img
                          src={item?.image || "/placeholder.png"}
                          alt={item?.name || "Product"}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 break-words">
                            {item?.name || "N/A"}
                          </h5>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item?.quantity || 0}
                          </p>
                          <div className="mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            {item.selectedColor && (
                              <span>Color: {item.selectedColor}</span>
                            )}
                            {item.selectedSize && (
                              <span>Size: {item.selectedSize}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {formatPrice((item?.price || 0).toFixed(0))}
                        </p>
                        {item?.discount > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice((item?.originalPrice || 0).toFixed(0))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer and Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaUser className="text-orange-500" />
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        User ID
                      </p>
                      <button
                        onClick={() => handleCopy(order?.userId, "User ID")}
                        className="p-1 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition-colors"
                        title="Copy User ID"
                      >
                        {copiedField === "User ID" ? (
                          <FaCheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <FaCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order?.userId || "N/A"}
                    </p>
                  </div>
                  {order?.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Notes
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" />
                  Shipping Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order?.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      District
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order?.district || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <FaCreditCard className="text-orange-500" />
                Payment Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {order?.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Status
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {order?.status || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Order Date
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(order?.orderDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <FaBox className="text-orange-500" />
                Order Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(calculateSubtotal().toFixed(0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Shipping Charge (
                    {order.district === "Dhaka"
                      ? "Inside Dhaka"
                      : "Outside Dhaka"}
                    ):
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(shippingCharge.toFixed(0))}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-base font-medium text-orange-600">
                      {formatPrice(total.toFixed(0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            {statusOptions && (
              <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaTruck className="text-orange-500" />
                  Update Order Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => onStatusUpdate(order._id, status.value)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                        order.status === status.value
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
