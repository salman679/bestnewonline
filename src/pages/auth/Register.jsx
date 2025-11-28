import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../lib/axiosInstanace";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../../components/auth/GoogleIcon";
import { AuthContext } from "../../context/auth/AuthContext";

const Register = () => {
  const { signIn, signInWithGoogle, createUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    const success = validateForm();

    if (!success) return;

    try {
      // First create the user in Firebase
      const userCredential = await createUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (user) {
        // Prepare user data with all required fields
        const userData = {
          fullName: formData.fullName,
          email: user.email,
          uid: user.uid, // Important: Include the Firebase UID
          profilePic: user.photoURL || "",
          role: "user",
        };

        // Save user to your backend
        const res = await axiosInstance.post("/auth/user", userData);

        if (res.data) {
          toast.success("Registration Successful!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      if (!user) {
        throw new Error("Google Sign-In failed");
      }

      // Prepare user data with all required fields
      const userData = {
        fullName: user.displayName,
        email: user.email,
        uid: user.uid,
        profilePic: user.photoURL || "",
        role: "user",
      };

      // Save user to your backend
      const res = await axiosInstance.post("/auth/user", userData);

      if (res.data) {
        toast.success("Google Sign-In Successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 p-10 max-[640px]:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-semibold font-bangla text-gray-900 mb-2">
            রেজিস্টার করুন
          </h1>
          <p className="text-sm text-gray-500 font-bangla">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={submitHandle} className="mb-6">
          {/* Full Name Input */}
          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-900 mb-2 font-bangla"
            >
              পূর্ণ নাম
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 font-sans focus:border-primary focus:bg-white"
              placeholder="আপনার নাম"
            />
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2 font-bangla"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 font-sans focus:border-primary focus:bg-white"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2 font-bangla"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 font-sans focus:border-primary focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-minimal btn-primary w-full font-bangla"
          >
            রেজিস্টার করুন
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[13px] text-gray-400 font-bangla">অথবা</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="btn-minimal btn-outline w-full flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-8 font-bangla">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold no-underline hover:underline"
          >
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
