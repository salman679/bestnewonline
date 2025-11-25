import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axiosInstanace';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaShoppingBag, FaHeart, FaStar, FaCartPlus } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const PublicProfile = () => {
  const { user } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const [orders, setOrders] = useState([]);
  const { cart, } = useContext(CartContext)


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance(`/order/user/${user?.uid}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, [user?.uid]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl max-[640px]:text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Member since {new Date(user?.Database?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to="/update-profile"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg max-[640px]:text-sm hover:bg-blue-600 transition-colors"
              >
                <FaEdit className="w-6 h-6" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">About</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <MdDescription className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Bio</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user?.Database?.bio || 'No bio available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FaEnvelope className="w-6 h-6 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user?.Database?.email}</p>
                  </div>
                </div>

                {user?.Database?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <FaPhone className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-400">{user?.Database?.phone}</p>
                    </div>
                  </div>
                )}

                {user?.Database?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <FaMapMarkerAlt className="w-6 h-6 textColor dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">{user?.Database?.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <FaShoppingBag className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Orders</h3>
                  <p className="text-2xl font-bold text-blue-500">{orders?.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <FaHeart className="w-8 h-8 textColor mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Wishlist</h3>
                  <p className="text-2xl font-bold textColor">{wishlist?.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <FaCartPlus className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Cart</h3>
                  <p className="text-2xl font-bold text-yellow-500">{cart?.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/my-orders"
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaShoppingBag className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaHeart className="w-5 h-5 textColor" />
                  <span className="text-gray-900 dark:text-white">Wishlist</span>
                </Link>
                <Link
                  to="/shopping-cart"
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaCartPlus className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">My Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile; 