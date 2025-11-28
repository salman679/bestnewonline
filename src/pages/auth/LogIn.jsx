// import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logo.png";
import GoogleIcon from "../../components/auth/GoogleIcon";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { axiosInstance } from "../../lib/axiosInstanace";

const LogIn = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form);

    try {
      await signIn(formData.email, formData.password);

      toast.success("Sign In Successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential?.user;
      const userData = {
        fullName: user?.displayName,
        email: user?.email,
        profilePic: user?.photoURL,
        uid: user?.uid, // Ensure UID is set correctly
        role: "user",
      };
      if (userData.uid) {
        // Check if UID is valid
        const addUserInfo = async () => {
          try {
            const res = await axiosInstance.post("/auth/user", userData);
          } catch (error) {
            console.error("Error adding user:", error);
          }
        };
        addUserInfo();
        toast.success("Google Sign In Successful");
        navigate("/");
      } else {
        toast.error("Google Sign-In failed. UID not found.");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 p-10 max-[640px]:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-semibold font-bangla text-gray-900 mb-2">
            লগইন করুন
          </h1>
          <p className="text-sm text-gray-500 font-bangla">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="mb-6">
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
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 font-sans focus:border-primary focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-minimal btn-primary w-full font-bangla"
          >
            লগইন করুন
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

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-8 font-bangla">
          নতুন অ্যাকাউন্ট?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold no-underline hover:underline"
          >
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
