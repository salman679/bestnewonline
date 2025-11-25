import { useContext, useState, useEffect } from "react";
import UploadImage from "./uploadImage";
import { MdAddAPhoto, MdEmail, MdPerson, MdPhone, MdLocationOn } from "react-icons/md";
import { axiosInstance } from "../lib/axiosInstanace";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cover, setCover] = useState(user?.profilePic || null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    phone: user?.Database?.phone || "",
    address: user?.Database?.address || "",
    bio: user?.Database?.bio || "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full Name is required!");
      return;
    }

    setLoading(true);
    try {
      // Update profile in Firebase
      await updateUserProfile(formData.fullName, cover);

      // Update additional user data in your backend
      const res = await axiosInstance.put("/auth/update-user", {
        ...formData,
        profilePic: cover,
        email: user.email,
        uid: user.uid
      });

      if (res.status === 200) {
        toast.success("Your profile has been updated successfully!");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Update Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Keep your profile information up to date</p>
            </div>

            {/* Profile Picture Section */}
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                  <img
                    src={cover || user?.photoURL || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg">
                  <UploadImage
                    setData={setCover}
                    setCoverProgress={setProgress}
                    maxFileSize={2}
                    allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  >
                    <MdAddAPhoto className="w-6 h-6 text-white cursor-pointer" />
                  </UploadImage>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {progress > 0 && (
              <div className="w-full max-w-xs mx-auto mb-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Uploading: {progress}%
                </p>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <MdPerson className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <MdEmail className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <MdPhone className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <MdLocationOn className="mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your address"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Tell us about yourself"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
