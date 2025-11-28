import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstanace";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaCartPlus,
  FaCamera,
  FaSave,
  FaTimes,
  FaLock,
  FaShieldAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaBoxOpen,
  FaHistory,
} from "react-icons/fa";
import { MdDescription, MdSecurity, MdDashboard } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import UploadImage from "./uploadImage";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const PublicProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    gender: "",
    dob: "",
  });
  const [cover, setCover] = useState(null);
  const [progress, setProgress] = useState(0);

  // Initialize Data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.displayName || "",
        phone: user.Database?.phone || "",
        address: user.Database?.address || "",
        bio: user.Database?.bio || "",
        gender: user.Database?.gender || "Male",
        dob: user.Database?.dob
          ? new Date(user.Database.dob).toISOString().split("T")[0]
          : "",
      });
      setCover(user.photoURL);
    }
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        try {
          const response = await axiosInstance(`/order/user/${user.uid}`);
          setOrders(response.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };
    fetchOrders();
  }, [user?.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (formData.phone && !/^\d{11}$/.test(formData.phone)) {
      toast.error("Please enter a valid 11-digit phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Update Firebase Profile if needed
      if (formData.fullName !== user.displayName || cover !== user.photoURL) {
        await updateUserProfile(formData.fullName, cover);
      }

      // Update Backend Database
      const res = await axiosInstance.put("/auth/update-user", {
        ...formData,
        profilePic: cover,
        email: user.email,
        uid: user.uid,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Optional: Reload to sync fresh data if Context doesn't update automatically
        window.location.reload();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!user?.email) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset email: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "address", label: "Address", icon: FaMapMarkerAlt },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "activity", label: "Activity", icon: FaHistory },
  ];

  return (
    <div className="min-h-screen py-8 font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-900 lg:py-12">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Header Card */}
        <div className="mb-8 overflow-hidden transition-all duration-300 bg-white shadow-xl dark:bg-gray-800 rounded-3xl">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute z-10 top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all border shadow-lg bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 rounded-xl active:scale-95"
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all shadow-lg bg-red-500/90 hover:bg-red-600 rounded-xl active:scale-95"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all shadow-lg bg-green-500/90 hover:bg-green-600 rounded-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative px-8 pt-2 pb-8">
            <div className="flex flex-col items-start gap-6 mb-6 -mt-20 md:flex-row md:items-end">
              <div className="relative group">
                <div className="w-32 h-32 overflow-hidden bg-white border-4 border-white rounded-full shadow-2xl md:w-40 md:h-40 dark:border-gray-800 dark:bg-gray-700">
                  <img
                    src={cover || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                {isEditing && (
                  <div className="absolute z-20 bottom-2 right-2">
                    <UploadImage
                      setData={setCover}
                      setCoverProgress={setProgress}
                      maxFileSize={5}
                      allowedFileTypes={[
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ]}
                    >
                      <div className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-lg border-2 border-white dark:border-gray-800 transition-colors">
                        <FaCamera className="w-4 h-4" />
                      </div>
                    </UploadImage>
                  </div>
                )}
              </div>

              <div className="flex-1 pt-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-1 text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 dark:text-white focus:outline-none md:w-auto"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {formData.fullName || "User Name"}
                  </h1>
                )}
                <p className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <FaEnvelope className="text-gray-400" /> {user.email}
                </p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Member Since:{" "}
                  {new Date(
                    user?.metadata?.creationTime || Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progress Bar for Image Upload */}
            {isEditing && progress > 0 && progress < 100 && (
              <div className="w-full max-w-md mb-6">
                <div className="flex justify-between mb-1 text-xs text-gray-500">
                  <span>Uploading Image...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-full transition-all duration-300 bg-blue-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-xl transition-all relative ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/50"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <tab.icon
                    className={activeTab === tab.id ? "text-blue-500" : ""}
                  />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="space-y-6 lg:col-span-2">
            {activeTab === "profile" && (
              <div className="p-6 space-y-6 bg-white shadow-sm dark:bg-gray-800 rounded-2xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                    <FaUser className="text-blue-500" /> Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 transition-all border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
                        placeholder="Tell something about yourself..."
                      />
                    ) : (
                      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                        {formData.bio || "No bio added yet."}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full py-3 pl-10 pr-4 transition-all border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
                          placeholder="01XXXXXXXXX"
                        />
                      ) : (
                        <div className="py-3 pl-10 pr-4 text-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                          {formData.phone || "N/A"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative opacity-70">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <div className="py-3 pl-10 pr-4 text-gray-700 bg-gray-100 cursor-not-allowed rounded-xl dark:bg-gray-700 dark:text-gray-300">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaVenusMars className="text-gray-400" />
                      </div>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full py-3 pl-10 pr-4 transition-all border-transparent appearance-none rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="py-3 pl-10 pr-4 text-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                          {formData.gender || "N/A"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full py-3 pl-10 pr-4 transition-all border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
                        />
                      ) : (
                        <div className="py-3 pl-10 pr-4 text-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                          {formData.dob
                            ? new Date(formData.dob).toLocaleDateString()
                            : "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-2xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                    <FaMapMarkerAlt className="text-orange-500" /> Manage
                    Addresses
                  </h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Delivery Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 transition-all border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-orange-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
                      placeholder="House No, Road No, Area, City, Zip Code..."
                    />
                  ) : (
                    <div className="p-6 border border-gray-100 rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700">
                      {formData.address ? (
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                          {formData.address}
                        </p>
                      ) : (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                          <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No address saved yet.</p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="mt-2 text-sm text-blue-500 hover:underline"
                          >
                            Add Address
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {!isEditing && formData.address && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-medium text-blue-500 hover:underline"
                    >
                      Change Address
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-2xl animate-fade-in">
                <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  <MdSecurity className="text-teal-500" /> Account Security
                </h2>

                <div className="p-6 border border-gray-100 bg-gray-50 dark:bg-gray-700/30 rounded-xl dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-100 rounded-full dark:bg-teal-900/30">
                      <FaLock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Change Password
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        We will send a password reset link to your email
                        address:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {user.email}
                        </span>
                      </p>
                      <button
                        onClick={handlePasswordReset}
                        className="mt-4 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="p-6 bg-white border-l-4 border-blue-500 shadow-sm dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Orders
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                          {orders.length}
                        </p>
                      </div>
                      <div className="p-3 text-blue-500 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <FaShoppingBag />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white border-l-4 border-red-500 shadow-sm dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Wishlist Items
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                          {wishlist.length}
                        </p>
                      </div>
                      <div className="p-3 text-red-500 rounded-full bg-red-50 dark:bg-red-900/20">
                        <FaHeart />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white border-l-4 border-yellow-500 shadow-sm dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cart Items
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                          {cart.length}
                        </p>
                      </div>
                      <div className="p-3 text-yellow-500 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                        <FaCartPlus />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders List (Simplified) */}
                <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-2xl">
                  <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900 dark:text-white">
                    <FaBoxOpen className="text-gray-400" /> Latest Orders
                  </h3>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      ))}
                      <Link
                        to="/my-orders"
                        className="block mt-2 text-sm font-medium text-center text-blue-500 hover:underline"
                      >
                        View All Orders
                      </Link>
                    </div>
                  ) : (
                    <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No recent orders found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Overview Card */}
            <div className="p-6 text-white shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                <MdDashboard className="text-blue-400" /> Dashboard
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <span className="text-sm text-gray-300">Account Status</span>
                  <span className="px-2 py-1 text-xs text-green-400 border rounded-full bg-green-500/20 border-green-500/30">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <span className="text-sm text-gray-300">Member Type</span>
                  <span className="text-sm font-medium text-white">
                    Customer
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <Link
                    to="/cart"
                    className="w-full block text-center py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
                  >
                    Go to Cart
                  </Link>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-2xl">
              <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                Need Help?
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Have questions or need assistance with your account?
              </p>
              <button className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
