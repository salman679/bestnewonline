import { IoCloseSharp } from "react-icons/io5";
import {
  FaChevronRight,
  FaHeart,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../lib/axiosInstanace";

import MenuSearchbar from "./MenuSearchbar";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { fetchProducts } from "../../redux/features/products/productSlice";

const Menu = ({ toggleMenu, isOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const category = location.pathname.split("/").pop();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        const menu = document.getElementById("menu-sidebar");
        if (menu && !menu.contains(event.target)) {
          toggleMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // সাবমেনু টগল করার ফাংশন
  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  // লগআউট ফাংশন
  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully");
    toggleMenu();
    navigate("/login");
  };

  // ক্যাটাগরি ডাটা লোড করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance("/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const clickSubMenu = (sub) => {
    dispatch(fetchProducts(sub));
    toggleMenu();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0000006d] bg-opacity-50 z-[90] transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Menu Sidebar */}
      <div
        id="menu-sidebar"
        className={`fixed top-0 left-0 z-[1000] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[85%] sm:w-[60%] md:w-[45%] lg:w-[35%] xl:w-[30%] h-screen flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Hind Siliguri, sans-serif" }}
          >
            মেনু
          </h2>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <IoCloseSharp className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <MenuSearchbar toggleMenu={toggleMenu} />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-4">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span
                  className="font-semibold text-sm uppercase tracking-wide"
                  style={{
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: "#374151",
                    letterSpacing: "0.5px",
                  }}
                >
                  হোম
                </span>
              </Link>
            </li>

            {/* Categories */}
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index}>
                  <Link
                    to={`/product-category/${category.category
                      .split(" ")
                      .join("-")}`}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => clickSubMenu(category?.category)}
                  >
                    <span
                      className="font-medium"
                      style={{
                        fontFamily: "Hind Siliguri, sans-serif",
                        color:
                          category?.category.split(" ").join("-") === category
                            ? "#016737"
                            : "#4B5563",
                        fontSize: "15px",
                      }}
                    >
                      {category?.category}
                    </span>
                    <FaChevronRight
                      className="transition-transform group-hover:translate-x-1"
                      style={{
                        color: "#9CA3AF",
                        fontSize: "12px",
                      }}
                    />
                  </Link>
                </div>
              ))
            ) : (
              <div className="space-y-3 p-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* User Menu Items */}
            <li className="mt-4 border-t border-gray-200 pt-4">
              <Link
                to="/wishlist"
                onClick={toggleMenu}
                className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaHeart
                  className="mr-3"
                  style={{ color: "#016737", fontSize: "18px" }}
                />
                <span
                  className="font-medium"
                  style={{
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: "#4B5563",
                  }}
                >
                  পছন্দের তালিকা
                </span>
              </Link>
              <Link
                to="/contact-us"
                onClick={toggleMenu}
                className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaEnvelope
                  className="mr-3"
                  style={{ color: "#016737", fontSize: "18px" }}
                />
                <span
                  className="font-medium"
                  style={{
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: "#4B5563",
                  }}
                >
                  যোগাযোগ করুন
                </span>
              </Link>
              <Link
                to="/my-orders"
                onClick={toggleMenu}
                className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaShoppingBag
                  className="mr-3"
                  style={{ color: "#016737", fontSize: "18px" }}
                />
                <span
                  className="font-medium"
                  style={{
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: "#4B5563",
                  }}
                >
                  আমার অর্ডার
                </span>
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/my-profile"
                    onClick={toggleMenu}
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaUser
                      className="mr-3"
                      style={{ color: "#016737", fontSize: "18px" }}
                    />
                    <span
                      className="font-medium"
                      style={{
                        fontFamily: "Hind Siliguri, sans-serif",
                        color: "#4B5563",
                      }}
                    >
                      আমার প্রোফাইল
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt
                      className="mr-3"
                      style={{ color: "#DC2626", fontSize: "18px" }}
                    />
                    <span
                      className="font-medium"
                      style={{
                        fontFamily: "Hind Siliguri, sans-serif",
                        color: "#DC2626",
                      }}
                    >
                      লগ আউট
                    </span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaUser
                    className="mr-3"
                    style={{ color: "#016737", fontSize: "18px" }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: "Hind Siliguri, sans-serif",
                      color: "#4B5563",
                    }}
                  >
                    লগইন / নিবন্ধন
                  </span>
                </Link>
              </li>
            )}
            {/* Footer */}
            <li className="mt-4 min-[640px]:hidden border-t border-gray-200 dark:border-gray-700 pt-4">
              <Link
                to="/"
                onClick={toggleMenu}
                className="flex items-center py-3 px-4 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-medium"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Menu;
