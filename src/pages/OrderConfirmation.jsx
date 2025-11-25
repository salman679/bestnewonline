import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag, FaBox, FaTruck, FaMapMarkerAlt, FaPhoneAlt, FaStickyNote, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { axiosInstance } from '../lib/axiosInstanace';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/auth/AuthContext';
import ScrollToTop from '../components/ScrollToTop';

const OrderConfirmation = () => {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Check for orderId in localStorage
        const orderId = localStorage.getItem('ChecklastOrderId');
        // Fetch order details
        const response = await axiosInstance.get(`/order/${orderId}`);
        if (response.data) {
          setOrder(response.data);
        } else {
          throw new Error('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);

        // More specific error message
        const errorMessage = error.response?.status === 404
          ? 'Order not found'
          : error.response?.data?.message || 'Failed to load order details';

        toast.error(errorMessage);


      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a user

    fetchOrderDetails();


    // Cleanup function
    return () => {
      localStorage.removeItem('lastOrderId');
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-4">
          <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Order Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find your order details.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            <FaHome className="text-lg" />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transform animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            অর্ডার সফলভাবে সম্পন্ন হয়েছে!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            আপনার অর্ডারের জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব。
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaStickyNote className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Information</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{order._id}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Payment</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <FaCopy className="text-gray-400" />
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaTruck className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Details</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">{order.address}</p>
                  <p className="text-gray-600 dark:text-gray-400">{order.district}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 border-t border-gray-100 dark:border-gray-700">
                <FaPhoneAlt className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{order.phone}</span>
              </div>
              {order.notes && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium block mb-1">Order Notes:</span>
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FaBox className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.items.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                  <div className="flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quantity: {item.quantity}</p>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex gap-3 mt-2">
                        {item.selectedColor && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {(item.price * item.quantity).toFixed(0)}৳
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.price.toFixed(0)}৳ × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {order.total.toFixed(0)}৳
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <FaHome className="text-lg" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <FaShoppingBag className="text-lg" />
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;