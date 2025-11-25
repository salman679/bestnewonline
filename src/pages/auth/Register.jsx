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
            রেজিস্টার করুন
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              fontFamily: "Hind Siliguri, sans-serif",
            }}
          >
            নতুন অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={submitHandle} style={{ marginBottom: "24px" }}>
          {/* Full Name Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="fullName"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1A1A1A",
                marginBottom: "8px",
                fontFamily: "Inter, sans-serif",
              }}
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
              placeholder="আপনার নাম"
            />
          </div>

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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
            রেজিস্টার করুন
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

        {/* Login Link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#666666",
            marginTop: "32px",
            fontFamily: "Hind Siliguri, sans-serif",
          }}
        >
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            to="/login"
            style={{
              color: "#016737",
              fontWeight: "600",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
