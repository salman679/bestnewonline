/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaChartBar, FaCog, FaSignOutAlt, FaArrowLeft, FaTimes, FaEnvelope } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    const fetchedCategories = [
      {
        name: "Dashboard",
        icon: <FaHome />,
        subMenu: [
          { name: "Overview", link: "/admin-dashboard" },
          // { name: "Analytics", link: "/admin-dashboard/analytics" }
        ]
      },
      {
        name: "Products",
        icon: <FaBox />,
        subMenu: [
          { name: "All Products", link: "/admin-dashboard/all-products" },
          { name: "Add Product", link: "/admin-dashboard/add-product" },
          { name: "Categories", link: "/admin-dashboard/add-category" }
        ]
      },
      {
        name: "Orders",
        icon: <FaShoppingCart />,
        subMenu: [
          // { name: "All Orders", link: "/admin-dashboard/orders" },
          { name: "Orders Management", link: "/admin-dashboard/orders/management" },
          { name: "Pending Orders", link: "/admin-dashboard/orders/pending" },
          { name: "Completed Orders", link: "/admin-dashboard/orders/completed" }
        ]
      },
      {
        name: "Users",
        icon: <FaUsers />,
        subMenu: [
          { name: "All Users", link: "/admin-dashboard/users" },

        ]
      },
      {
        name: "Banner Management",
        icon: <FaEnvelope />,
        subMenu: [
          { name: "Control Banners", link: "/admin-dashboard/banner-management" },
        ]
      },
      {
        name: "Messages",
        icon: <FaEnvelope />,
        subMenu: [
          { name: "All Messages", link: "/admin-dashboard/contact-messages" },

        ]
      },
      // {
      //   name: "Reports",
      //   icon: <FaChartBar />,
      //   subMenu: [
      //     { name: "Sales Report", link: "/admin-dashboard/sales-report" },

      //   ]
      // },
      {
        name: "Settings",
        icon: <FaCog />,
        subMenu: [
          { name: "General Settings", link: "/admin-dashboard/settings" },
          { name: "FaceBook Pixel", link: "/admin-dashboard/facebook-pixel" },

        ]
      }
    ];

    setCategories(fetchedCategories);
  }, []);

  const toggleSubMenu = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toggleSidebar(); // Close sidebar after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <nav
        id="sidebar"
        className={`fixed lg:relative lg:w-[270px] w-[270px] h-screen bg-gray-900 shrink-0 z-[59] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Sidebar Body */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    className={`w-full flex items-center text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-3 py-2.5 transition-all duration-300 ${location.pathname.startsWith(category.subMenu[0].link) ? 'bg-gray-800 text-white' : ''
                      }`}
                    onClick={() => toggleSubMenu(index)}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span className="flex-1 text-left">{category.name}</span>
                    <span className={`ml-auto transition-transform duration-300 ${activeIndex === index ? 'rotate-90' : 'rotate-0'}`}>
                      ▶
                    </span>
                  </button>

                  {activeIndex === index && (
                    <ul className="ml-6 space-y-1 mt-2">
                      {category.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.link}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={`block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md px-3 py-2 transition-all duration-300 ${location.pathname === subItem.link ? 'bg-gray-800 text-white' : ''
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <Link
              to="/"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className="w-full flex items-center text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-3 py-2.5 transition-all duration-300 mb-2"
            >
              <FaArrowLeft className="mr-3" />
              <span>Return to Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-3 py-2.5 transition-all duration-300"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
