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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#FAFAFA",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #F0F0F0",
          padding: "48px 40px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
        className="max-[640px]:p-8"
      >
        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "600",
              fontFamily: "Hind Siliguri, sans-serif",
              color: "#1A1A1A",
              marginBottom: "8px",
            }}
          >
            লগইন করুন
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              fontFamily: "Hind Siliguri, sans-serif",
            }}
          >
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} style={{ marginBottom: "24px" }}>
          {/* Email Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1A1A1A",
                marginBottom: "8px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#1A1A1A",
                backgroundColor: "#FAFAFA",
                border: "1px solid #E8E8E8",
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.2s ease",
                fontFamily: "Inter, sans-serif",
              }}
              className="focus:border-[#016737] focus:bg-white"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1A1A1A",
                marginBottom: "8px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#1A1A1A",
                backgroundColor: "#FAFAFA",
                border: "1px solid #E8E8E8",
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.2s ease",
                fontFamily: "Inter, sans-serif",
              }}
              className="focus:border-[#016737] focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 24px",
              backgroundColor: "#016737",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: "600",
              fontFamily: "Hind Siliguri, sans-serif",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            className="hover:opacity-90"
          >
            লগইন করুন
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#E8E8E8" }} />
          <span
            style={{
              fontSize: "13px",
              color: "#999999",
              fontFamily: "Hind Siliguri, sans-serif",
            }}
          >
            অথবা
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#E8E8E8" }} />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: "100%",
            padding: "12px 24px",
            backgroundColor: "#FFFFFF",
            color: "#1A1A1A",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "Inter, sans-serif",
            border: "1px solid #E8E8E8",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          className="hover:bg-[#FAFAFA]"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#666666",
            marginTop: "32px",
            fontFamily: "Hind Siliguri, sans-serif",
          }}
        >
          নতুন অ্যাকাউন্ট?{" "}
          <Link
            to="/register"
            style={{
              color: "#016737",
              fontWeight: "600",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
