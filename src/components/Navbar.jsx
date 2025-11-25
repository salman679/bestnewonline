import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/buynestonline.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import avatar from "../assets/images/profileAvatar.png";
import { TbCategoryMinus, TbCategoryPlus } from "react-icons/tb";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch,
  FaChevronDown,
  FaShoppingBag,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaBell,
  FaQuestionCircle,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import Menu from "./menu-sidebar/Menu";
import LogIn from "./auth/LogIn";
import { CartContext } from "../context/CartContext";
import SidebarCart from "./shopping/SidebarCart";
import { AuthContext } from "../context/auth/AuthContext";
import Search from "./Search";
import { axiosInstance } from "../lib/axiosInstanace";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/features/products/productSlice";
import { IndexContext } from "../context";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FcShop } from "react-icons/fc";
import { WishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const location = useLocation();
  const categorypath = location.pathname.split("/")[2];
  const subCategory = location.pathname.split("/")[3];
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const [profileDrop, setProfileDrop] = useState(false);
  const [mobileProfileDrop, setMobileProfileDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { logOut } = useContext(AuthContext);
  const { siteSettings } = useContext(IndexContext);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const { user, isLoading } = useContext(AuthContext);

  // Profie dropDown menu setups
  const dropdownRef = useRef(null);

  const profileHandle = () => {
    setProfileDrop((prev) => !prev);
  };

  const mobileProfileHandle = () => {
    setMobileProfileDrop((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [categories, setCategories] = useState(null); // Default null
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance("/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleHandleOff = () => {
    setIsOpen(false);
    setIsCartOpen(false);
    setMobileProfileDrop(false);
  };
  const toggleHandleOn = () => {
    setIsOpen(true);
    setIsCartOpen(false);
    setMobileProfileDrop(false);
  };

  const handleCategoryClick = (category) => {
    // Apply the new category filter
    dispatch(fetchProducts(category));
  };

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #F0F0F0",
          boxShadow: "none",
        }}
      >
        {/* Main Header Section - Ultra Modern Premium */}
        <div
          style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            className="flex items-center justify-between gap-8"
            style={{ height: "80px" }}
          >
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden"
              style={{
                background: "none",
                border: "none",
                color: "#1A1A1A",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Logo - Left */}
            <Link to={"/"} className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="BuyNest"
                className="max-[640px]:w-24"
                style={{ height: "40px", width: "auto" }}
              />
            </Link>

            {/* Categories - Center (Desktop) */}
            <div className="flex-1 flex items-center justify-center gap-6 mx-8 max-[1024px]:hidden">
              <Link
                to={"/"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: path === "/" ? "#016737" : "#666666",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: path === "/" ? "#F0FDF4" : "transparent",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                className="hover:bg-gray-50"
              >
                হোম
              </Link>
              {categoryLoading ? (
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: "20px",
                        width: "80px",
                        backgroundColor: "#F0F0F0",
                        borderRadius: "4px",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    ></div>
                  ))}
                </div>
              ) : (
                categories?.slice(0, 4).map((category) => (
                  <Link
                    key={category._id}
                    to={`/product-category/${category.category
                      .split(" ")
                      .join("-")}`}
                    onClick={() => handleCategoryClick(category.category)}
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      fontFamily: "Hind Siliguri, sans-serif",
                      color:
                        path ===
                        `/product-category/${category.category
                          .split(" ")
                          .join("-")}`
                          ? "#016737"
                          : "#666666",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      backgroundColor:
                        path ===
                        `/product-category/${category.category
                          .split(" ")
                          .join("-")}`
                          ? "#F0FDF4"
                          : "transparent",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    className="hover:bg-gray-50"
                  >
                    {category.category}
                  </Link>
                ))
              )}
            </div>

            {/* Search Bar - Right Side (Compact) */}
            <div className="max-[1024px]:hidden" style={{ width: "280px" }}>
              <Search />
            </div>

            {/* Right Side Icons - Premium Minimal */}
            <div className="flex items-center gap-6 max-[640px]:gap-4 flex-shrink-0 ml-6">
              <div className="flex items-center space-x-5 max-[640px]:space-x-4">
                <div className="flex items-center">
                  <ul className="flex max-[640px]:hidden space-x-5 items-center">
                    {/* profile icon */}
                    {user ? (
                      <li className="relative max-[640px]:hidden  duration-300 px-1 ">
                        <img
                          onClick={profileHandle}
                          className={`w-12 h-12 hover:border-2 hover:border-cyan-500 max-sm:w-10 max-sm:h-10 object-cover border cursor-pointer rounded-full ${
                            profileDrop && "border-2 border-cyan-500"
                          }`}
                          src={`${user?.photoURL ? user?.photoURL : avatar}`}
                          alt=""
                        />

                        {/* Dropdown menu */}
                        {profileDrop && (
                          <ul
                            ref={dropdownRef}
                            className="max-[640px]:hidden overflow-y-auto"
                          >
                            <div className="absolute z-[60] right-0 max-[640px]:max-w-[250px] max-[640px]:max-h-[600px] overflow-y-auto duration-300 w-80 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                              {/* User Info Section */}
                              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                                    <img
                                      src={user?.photoURL}
                                      alt={user?.displayName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                                </div>
                                <div>
                                  <h6 className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {user?.displayName}
                                  </h6>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user?.Database?.email}
                                  </p>
                                </div>
                              </div>

                              {/* Main Menu */}
                              <div className="">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                  Menu
                                </h3>
                                <div className="space-y-1">
                                  {user?.Database?.role === "admin" && (
                                    <Link
                                      to="/admin-dashboard"
                                      onClick={profileHandle}
                                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                        path === "/admin-dashboard"
                                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                      }`}
                                    >
                                      <FaTachometerAlt className="w-5 h-5" />
                                      <span className="font-medium">
                                        Dashboard
                                      </span>
                                    </Link>
                                  )}
                                  <Link
                                    to="/my-profile"
                                    onClick={profileHandle}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <FaUserCircle className="w-5 h-5 text-purple-500" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                      My Profile
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              {/* Support & Settings */}
                              <div className="">
                                <div className="space-y-1">
                                  <Link
                                    to="/contact-us"
                                    onClick={profileHandle}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <FaEnvelope className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                      Contact Us
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              {/* Security &  */}
                              <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                  Logout
                                </h3>
                                <div className="space-y-1">
                                  <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg textColor hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    <FaSignOutAlt className="w-5 h-5" />
                                    <span className="font-medium">Log Out</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ul>
                        )}
                      </li>
                    ) : (
                      <Link to={"/login"}>
                        <FaUser className="text-xl cursor-pointer max-[1024px]:hidden" />
                      </Link>
                    )}
                  </ul>
                </div>

                {/* Wishlist Icon */}
                <Link className="max-[1000px]:hidden" to={"/wishlist"}>
                  <div className="relative">
                    <FaHeart
                      className="w-5 h-5 cursor-pointer transition-colors"
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    {wishlist.length > 0 && (
                      <div
                        className="w-4 h-4 absolute -top-2 -right-2 text-white text-[10px] rounded-full flex justify-center items-center font-semibold"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <span>{wishlist.length}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Cart Icon */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    if (path !== "/shopping-cart") {
                      setIsCartOpen(!isCartOpen);
                    }
                  }}
                >
                  <div className="relative">
                    <FaShoppingCart
                      className="w-5 h-5 transition-colors"
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    {cart.length > 0 && (
                      <div
                        className="w-4 h-4 absolute -top-2 -right-2 text-white text-[10px] rounded-full flex justify-center items-center font-semibold"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <span>{cart.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* menubar isOpen */}
        <Menu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleMenu={toggleMenu}
          profileHandle={profileHandle}
        />
        <SidebarCart />
      </header>

      {/* Mobile Bottom Navigation Bar - Premium Floating Island Design */}
      <div
        className="fixed sm:hidden z-50 bottom-4 left-4 right-4 rounded-2xl"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          className="grid grid-cols-5 w-full items-center justify-items-center"
          style={{ height: "70px" }}
        >
          {/* Category */}
          {isOpen ? (
            <button
              onClick={toggleHandleOff}
              type="button"
              className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300"
            >
              <div
                className="p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: isOpen
                    ? "rgba(1, 103, 55, 0.1)"
                    : "transparent",
                }}
              >
                <TbCategoryMinus
                  className="w-6 h-6"
                  style={{ color: "#016737" }}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: "#016737",
                }}
              >
                বন্ধ করুন
              </span>
            </button>
          ) : (
            <button
              onClick={toggleHandleOn}
              type="button"
              className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300"
            >
              <div
                className="p-1.5 rounded-full transition-colors"
                style={{ backgroundColor: "transparent" }}
              >
                <TbCategoryPlus
                  className="w-6 h-6"
                  style={{ color: "#6B7280" }}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: "#6B7280",
                }}
              >
                ক্যাটাগরি
              </span>
            </button>
          )}

          {/* Wishlist */}
          <Link
            className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300"
            to={"/wishlist"}
            onClick={() => (setIsCartOpen(false), setMobileProfileDrop(false))}
          >
            <div
              className="relative p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor:
                  path === "/wishlist"
                    ? "rgba(1, 103, 55, 0.1)"
                    : "transparent",
              }}
            >
              <FaHeart
                className="w-5 h-5"
                style={{ color: path === "/wishlist" ? "#016737" : "#6B7280" }}
              />
              {wishlist.length > 0 && (
                <div
                  className="w-4 h-4 absolute -top-1 -right-1 text-white text-[10px] rounded-full flex justify-center font-bold items-center shadow-sm"
                  style={{
                    backgroundColor: "#DC2626",
                    border: "2px solid white",
                  }}
                >
                  <span>{wishlist.length}</span>
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "Hind Siliguri, sans-serif",
                color: path === "/wishlist" ? "#016737" : "#6B7280",
              }}
            >
              পছন্দের
            </span>
          </Link>
          {/* Cart */}
          <div
            className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300 cursor-pointer"
            onClick={() => {
              if (path !== "/shopping-cart") {
                setIsCartOpen(!isCartOpen);
                setMobileProfileDrop(false);
              }
            }}
          >
            <div
              className="relative p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor:
                  isCartOpen || path === "/shopping-cart"
                    ? "rgba(1, 103, 55, 0.1)"
                    : "transparent",
              }}
            >
              <FaShoppingCart
                className="w-5 h-5"
                style={{
                  color:
                    isCartOpen || path === "/shopping-cart"
                      ? "#016737"
                      : "#6B7280",
                }}
              />
              {cart.length > 0 && (
                <div
                  className="w-4 h-4 absolute -top-1 -right-1 text-white text-[10px] rounded-full flex justify-center items-center font-bold shadow-sm"
                  style={{
                    backgroundColor: "#DC2626",
                    border: "2px solid white",
                  }}
                >
                  <span>{cart.length}</span>
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "Hind Siliguri, sans-serif",
                color:
                  isCartOpen || path === "/shopping-cart"
                    ? "#016737"
                    : "#6B7280",
              }}
            >
              কার্ট
            </span>
          </div>
          {/* Shop */}
          <Link
            to={"/product-category"}
            onClick={() => (setIsCartOpen(false), setMobileProfileDrop(false))}
            className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300"
          >
            <div
              className="p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: path.includes("/product-category")
                  ? "rgba(1, 103, 55, 0.1)"
                  : "transparent",
              }}
            >
              <FaShoppingBag
                className="w-5 h-5"
                style={{
                  color: path.includes("/product-category")
                    ? "#016737"
                    : "#6B7280",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "Hind Siliguri, sans-serif",
                color: path.includes("/product-category")
                  ? "#016737"
                  : "#6B7280",
              }}
            >
              শপ
            </span>
          </Link>
          {/* User */}
          {user ? (
            <div className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300">
              <button
                onClick={() => (setIsCartOpen(false), mobileProfileHandle())}
                type="button"
                className="inline-flex flex-col items-center justify-center gap-1"
              >
                <img
                  className={`w-7 h-7 object-cover border-2 cursor-pointer rounded-full transition-all ${
                    mobileProfileDrop
                      ? "border-[#016737]"
                      : "border-transparent"
                  }`}
                  src={`${user?.photoURL ? user?.photoURL : avatar}`}
                  alt="Profile"
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: mobileProfileDrop ? "#016737" : "#6B7280",
                  }}
                >
                  প্রোফাইল
                </span>
              </button>

              {mobileProfileDrop && (
                <ul
                  ref={dropdownRef}
                  className="max-[640px]:max-h-[400px] overflow-y-auto"
                >
                  <div className="absolute z-[10000] right-0 bottom-11 max-[640px]:max-w-[250px] max-[640px]:max-h-[600px] overflow-y-auto duration-300 w-80 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                    <button
                      onClick={() => setMobileProfileDrop(false)} // Add your function to hide the dropdown
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimes className=" cursor-pointer  w-5 h-5" />
                    </button>
                    {/* User Info Section */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                          <img
                            src={user?.photoURL}
                            alt={user?.displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div>
                        <h6 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {user?.displayName}
                        </h6>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user?.Database?.email}
                        </p>
                      </div>
                    </div>

                    {/* Main Menu */}
                    <div className="">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Menu
                      </h3>
                      <div className="space-y-1">
                        {user?.Database?.role === "admin" && (
                          <Link
                            to="/admin-dashboard"
                            onClick={mobileProfileHandle}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              path === "/admin-dashboard"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <FaTachometerAlt className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/my-profile"
                          onClick={mobileProfileHandle}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaUserCircle className="w-5 h-5 text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            My Profile
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Support & Settings */}
                    <div className="">
                      <div className="space-y-1">
                        <Link
                          to="/contact-us"
                          onClick={mobileProfileHandle}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaEnvelope className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Contact Us
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Security &  */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Logout
                      </h3>
                      <div className="space-y-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 rounded-lg textColor hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FaSignOutAlt className="w-5 h-5" />
                          <span className="font-medium">Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to={"/login"}
              onClick={() => setIsCartOpen(false)}
              className="inline-flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-300"
            >
              <div
                className="p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    path === "/login" ? "rgba(1, 103, 55, 0.1)" : "transparent",
                }}
              >
                <FaUser
                  className="w-5 h-5"
                  style={{ color: path === "/login" ? "#016737" : "#6B7280" }}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: path === "/login" ? "#016737" : "#6B7280",
                }}
              >
                লগইন
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
