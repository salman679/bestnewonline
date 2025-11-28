import { useContext, useState, useEffect } from "react";
import UploadImage from "./uploadImage";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaCartPlus,
  FaSave,
  FaTimes,
  FaCamera,
  FaTachometerAlt,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";
import { MdDescription, MdSecurity } from "react-icons/md";
import { axiosInstance } from "../lib/axiosInstanace";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(null);
  const [progress, setProgress] = useState(0);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    gender: "",
    dob: "",
  });

  // Initialize data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.displayName || "",
        phone: user.Database?.phone || "",
        address: user.Database?.address || "",
        bio: user.Database?.bio || "",
        gender: user.Database?.gender || "",
        dob: user.Database?.dob
          ? new Date(user.Database.dob).toISOString().split("T")[0]
          : "",
      });
      setCover(user.photoURL);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch Orders Count
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("নাম আবশ্যক!");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(formData.fullName, cover);
      const res = await axiosInstance.put("/auth/update-user", {
        ...formData,
        profilePic: cover,
        email: user.email,
        uid: user.uid,
      });

      if (res.status === 200) {
        toast.success("প্রোফাইল আপডেট করা হয়েছে!");
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("প্রোফাইল আপডেট ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 font-sans bg-gray-50 dark:bg-gray-900 font-hind-siliguri">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Profile Header Card */}
        <div className="relative mb-8 overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
            {/* Edit Toggle Button (Top Right) */}
            <div className="absolute z-10 top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors border rounded-lg shadow-sm bg-white/20 backdrop-blur-md hover:bg-white/30 border-white/30"
                >
                  <FaEdit /> এডিট প্রোফাইল
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-red-500/80 hover:bg-red-600"
                  >
                    <FaTimes /> বাতিল
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                    ) : (
                      <FaSave />
                    )}
                    সেভ করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Info Overlay */}
          <div className="relative px-8 pb-6">
            <div className="flex flex-col items-start mb-4 -mt-16 md:flex-row md:items-end">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 overflow-hidden bg-white border-4 border-white rounded-full shadow-md dark:border-gray-800">
                  <img
                    src={cover || "https://via.placeholder.com/150"}
                    alt={user?.displayName}
                    className="object-cover w-full h-full"
                  />
                </div>
                {isEditing && (
                  <div className="absolute bottom-2 right-2">
                    <UploadImage
                      setData={setCover}
                      setCoverProgress={setProgress}
                      maxFileSize={2}
                      allowedFileTypes={[
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ]}
                    >
                      <div className="p-2 text-white transition-colors bg-blue-600 border-2 border-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 dark:border-gray-800">
                        <FaCamera className="w-4 h-4" />
                      </div>
                    </UploadImage>
                  </div>
                )}
              </div>

              {/* Name & Meta */}
              <div className="flex-1 mt-4 md:mt-0 md:ml-6">
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 dark:text-white focus:outline-none md:w-auto"
                    placeholder="আপনার নাম"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formData.fullName}
                  </h1>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-bangla">
                  সদস্য যোগদানের তারিখ:{" "}
                  {new Date(
                    user?.Database?.createdAt || Date.now()
                  ).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {isEditing && progress > 0 && progress < 100 && (
              <div className="w-32 mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  আপলোড হচ্ছে: {progress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column (Details) */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white font-bangla">
                <FaUser className="text-blue-500" /> ব্যক্তিগত তথ্য
              </h2>

              <div className="space-y-6">
                {/* Bio */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <MdDescription className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400 font-bangla">
                      বায়ো
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-3 transition-all border outline-none rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="আপনার সম্পর্কে লিখুন..."
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 font-bangla">
                        {formData.bio || "কোন তথ্য দেওয়া হয়নি"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20">
                    <FaEnvelope className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400 font-bangla">
                      ইমেইল
                    </label>
                    <p className="font-mono text-gray-800 dark:text-gray-200">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20">
                    <FaPhone className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400 font-bangla">
                      ফোন
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 transition-all border rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                        placeholder="আপনার ফোন নম্বর"
                      />
                    ) : (
                      <p className="font-mono text-gray-800 dark:text-gray-200">
                        {formData.phone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20">
                    <FaMapMarkerAlt className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400 font-bangla">
                      ঠিকানা
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 transition-all border outline-none rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-500"
                        rows="2"
                        placeholder="আপনার ঠিকানা"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 font-bangla">
                        {formData.address || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white font-bangla">
                <FaTachometerAlt className="text-indigo-500" /> এক্টিভিটি
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="p-4 text-center border border-blue-100 rounded-xl bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                  <FaShoppingBag className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bangla">
                    মোট অর্ডার
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {orders.length}
                  </p>
                </div>
                <div className="p-4 text-center border border-red-100 rounded-xl bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                  <FaHeart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bangla">
                    উইশলিস্ট
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {wishlist.length}
                  </p>
                </div>
                <div className="p-4 text-center border border-yellow-100 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
                  <FaCartPlus className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bangla">
                    কার্ট
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {cart.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white font-bangla">
                <MdSecurity className="text-teal-500" /> নিরাপত্তা
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white font-bangla">
                    পাসওয়ার্ড পরিবর্তন
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-bangla">
                    আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন
                  </p>
                </div>
                <button
                  onClick={() => toast("শীঘ্রই আসছে")}
                  className="px-4 py-2 text-sm font-medium text-teal-600 transition-colors rounded-lg bg-teal-50 hover:bg-teal-100 font-bangla"
                >
                  পরিবর্তন করুন
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Quick Actions) */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700 top-24">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white font-bangla">
                দ্রুত লিঙ্ক
              </h2>
              <div className="space-y-3">
                <Link
                  to="/my-orders"
                  className="flex items-center justify-between p-4 transition-all rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30">
                      <FaShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 font-bangla">
                      আমার অর্ডার
                    </span>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-4 transition-all rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 rounded-full dark:bg-red-900/30">
                      <FaHeart className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 font-bangla">
                      উইশলিস্ট
                    </span>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/shopping-cart"
                  className="flex items-center justify-between p-4 transition-all rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 text-yellow-600 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
                      <FaCartPlus className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 font-bangla">
                      আমার কার্ট
                    </span>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
