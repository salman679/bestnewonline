import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import avatar from "../assets/images/profileAvatar.png";
import { TbCategoryMinus, TbCategoryPlus } from "react-icons/tb";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaShoppingBag,
  FaEnvelope,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import Menu from "./menu-sidebar/Menu";
import { CartContext } from "../context/CartContext";
import SidebarCart from "./shopping/SidebarCart";
import { AuthContext } from "../context/auth/AuthContext";
import Search from "./Search";
import { axiosInstance } from "../lib/axiosInstanace";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/features/products/productSlice";
import { WishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const [profileDrop, setProfileDrop] = useState(false);
  const [mobileProfileDrop, setMobileProfileDrop] = useState(false);
  const { isCartOpen, setIsCartOpen, cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { logOut } = useContext(AuthContext);
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
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-none">
        {/* Main Header Section - Ultra Modern Premium */}
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden bg-none border-none text-[#1A1A1A] cursor-pointer p-2"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Logo - Left */}
            <Link to={"/"} className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="BuyNest"
                className="max-[640px]:w-24 h-10 w-auto"
              />
            </Link>

            {/* Categories - Center (Desktop) */}
            <div className="flex-1 flex items-center justify-center gap-6 mx-8 max-[1024px]:hidden">
              <Link
                to={"/"}
                className={`text-sm font-medium font-bangla px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap hover:bg-gray-50 no-underline ${
                  path === "/"
                    ? "text-primary bg-green-50"
                    : "text-gray-500 bg-transparent"
                }`}
              >
                হোম
              </Link>
              {categoryLoading ? (
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-5 bg-gray-100 rounded animate-pulse"
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
                    className={`text-sm font-medium font-bangla px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap hover:bg-gray-50 no-underline ${
                      path ===
                      `/product-category/${category.category
                        .split(" ")
                        .join("-")}`
                        ? "text-primary bg-green-50"
                        : "text-gray-500 bg-transparent"
                    }`}
                  >
                    {category.category}
                  </Link>
                ))
              )}
            </div>

            {/* Search Bar - Right Side (Compact) */}
            <div className="max-[1024px]:hidden w-[280px]">
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
                          <ul ref={dropdownRef} className="max-[640px]:hidden">
                            <div className="absolute z-[60] right-0 mt-2 w-[280px] p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 origin-top-right">
                              {/* User Info Section */}
                              <div className="flex items-center gap-3 pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="relative shrink-0">
                                  <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700">
                                    <img
                                      src={user?.photoURL || avatar}
                                      alt={user?.displayName}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                                </div>
                                <div className="min-w-0">
                                  <h6 className="text-sm font-semibold text-gray-900 truncate dark:text-white font-bangla">
                                    {user?.displayName}
                                  </h6>
                                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                    {user?.email || user?.Database?.email}
                                  </p>
                                </div>
                              </div>

                              {/* Main Menu */}
                              <div className="mb-2">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 font-bangla">
                                  মেনু
                                </h3>
                                <div className="space-y-1">
                                  {user?.Database?.role === "admin" && (
                                    <Link
                                      to="/admin-dashboard"
                                      onClick={() => setProfileDrop(false)}
                                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-bangla"
                                    >
                                      <FaTachometerAlt className="w-4 h-4 text-blue-500" />
                                      ড্যাশবোর্ড
                                    </Link>
                                  )}
                                  <Link
                                    to="/my-profile"
                                    onClick={() => setProfileDrop(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-bangla"
                                  >
                                    <FaUserCircle className="w-4 h-4 text-purple-500" />
                                    প্রোফাইল
                                  </Link>
                                  <Link
                                    to="/my-orders"
                                    onClick={() => setProfileDrop(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-bangla"
                                  >
                                    <FaShoppingBag className="w-4 h-4 text-orange-500" />
                                    আমার অর্ডার
                                  </Link>
                                  <Link
                                    to="/contact-us"
                                    onClick={() => setProfileDrop(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-bangla"
                                  >
                                    <FaEnvelope className="w-4 h-4 text-green-500" />
                                    যোগাযোগ করুন
                                  </Link>
                                </div>
                              </div>

                              {/* Logout */}
                              <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 font-bangla">
                                  অ্যাকাউন্ট
                                </h3>
                                <button
                                  onClick={handleLogout}
                                  className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-bangla"
                                >
                                  <FaSignOutAlt className="w-4 h-4" />
                                  লগ আউট
                                </button>
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
                    <FaHeart className="w-5 h-5 cursor-pointer transition-colors text-[var(--color-text-secondary)]" />
                    {wishlist.length > 0 && (
                      <div className="w-4 h-4 absolute -top-2 -right-2 text-white text-[10px] rounded-full flex justify-center items-center font-semibold bg-primary">
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
                    <FaShoppingCart className="w-5 h-5 transition-colors text-[var(--color-text-secondary)]" />
                    {cart.length > 0 && (
                      <div className="w-4 h-4 absolute -top-2 -right-2 text-white text-[10px] rounded-full flex justify-center items-center font-semibold bg-primary">
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
      <div className="fixed sm:hidden z-50 bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-5 w-full items-center justify-items-center h-[70px]">
          {/* Category */}
          {isOpen ? (
            <button
              onClick={toggleHandleOff}
              type="button"
              className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  isOpen ? "bg-primary/10" : "bg-transparent"
                }`}
              >
                <TbCategoryMinus className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[11px] font-semibold font-bangla text-primary">
                বন্ধ করুন
              </span>
            </button>
          ) : (
            <button
              onClick={toggleHandleOn}
              type="button"
              className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
            >
              <div className="p-1.5 rounded-full transition-colors bg-transparent">
                <TbCategoryPlus className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-[11px] font-semibold font-bangla text-gray-500">
                ক্যাটাগরি
              </span>
            </button>
          )}

          {/* Wishlist */}
          <Link
            className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
            to={"/wishlist"}
            onClick={() => (setIsCartOpen(false), setMobileProfileDrop(false))}
          >
            <div
              className={`relative p-1.5 rounded-full transition-colors ${
                path === "/wishlist" ? "bg-primary/10" : "bg-transparent"
              }`}
            >
              <FaHeart
                className={`w-5 h-5 ${
                  path === "/wishlist" ? "text-primary" : "text-gray-500"
                }`}
              />
              {wishlist.length > 0 && (
                <div className="w-4 h-4 absolute -top-1 -right-1 text-white text-[10px] rounded-full flex justify-center font-bold items-center shadow-sm bg-red-600 border-2 border-white">
                  <span>{wishlist.length}</span>
                </div>
              )}
            </div>
            <span
              className={`text-[11px] font-semibold font-bangla ${
                path === "/wishlist" ? "text-primary" : "text-gray-500"
              }`}
            >
              পছন্দের
            </span>
          </Link>
          {/* Cart */}
          <div
            className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer active:scale-90"
            onClick={() => {
              if (path !== "/shopping-cart") {
                setIsCartOpen(!isCartOpen);
                setMobileProfileDrop(false);
              }
            }}
          >
            <div
              className={`relative p-1.5 rounded-full transition-colors ${
                isCartOpen || path === "/shopping-cart"
                  ? "bg-primary/10"
                  : "bg-transparent"
              }`}
            >
              <FaShoppingCart
                className={`w-5 h-5 ${
                  isCartOpen || path === "/shopping-cart"
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              />
              {cart.length > 0 && (
                <div className="w-4 h-4 absolute -top-1 -right-1 text-white text-[10px] rounded-full flex justify-center items-center font-bold shadow-sm bg-red-600 border-2 border-white">
                  <span>{cart.length}</span>
                </div>
              )}
            </div>
            <span
              className={`text-[11px] font-semibold font-bangla ${
                isCartOpen || path === "/shopping-cart"
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              কার্ট
            </span>
          </div>
          {/* Shop */}
          <Link
            to={"/product-category"}
            onClick={() => (setIsCartOpen(false), setMobileProfileDrop(false))}
            className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
          >
            <div
              className={`p-1.5 rounded-full transition-colors ${
                path.includes("/product-category")
                  ? "bg-primary/10"
                  : "bg-transparent"
              }`}
            >
              <FaShoppingBag
                className={`w-5 h-5 ${
                  path.includes("/product-category")
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              />
            </div>
            <span
              className={`text-[11px] font-semibold font-bangla ${
                path.includes("/product-category")
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              শপ
            </span>
          </Link>
          {/* User */}
          {user ? (
            <Link
              to="/my-profile"
              onClick={() => setIsCartOpen(false)}
              className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
            >
              <img
                className={`w-7 h-7 object-cover border-2 cursor-pointer rounded-full transition-all ${
                  path === "/my-profile"
                    ? "border-primary"
                    : "border-transparent"
                }`}
                src={`${user?.photoURL ? user?.photoURL : avatar}`}
                alt="Profile"
              />
              <span
                className={`text-[11px] font-semibold font-bangla ${
                  path === "/my-profile" ? "text-primary" : "text-gray-500"
                }`}
              >
                প্রোফাইল
              </span>
            </Link>
          ) : (
            <Link
              to={"/login"}
              onClick={() => setIsCartOpen(false)}
              className="inline-flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  path === "/login" ? "bg-primary/10" : "bg-transparent"
                }`}
              >
                <FaUser
                  className={`w-5 h-5 ${
                    path === "/login" ? "text-primary" : "text-gray-500"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-semibold font-bangla ${
                  path === "/login" ? "text-primary" : "text-gray-500"
                }`}
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
