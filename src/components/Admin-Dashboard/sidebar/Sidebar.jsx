import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaArrowLeft,
  FaTimes,
  FaChevronRight,
  FaLeaf,
  FaTruck,
} from "react-icons/fa";
import { AuthContext } from "../../../context/auth/AuthContext";

// Define menu items
const menuItems = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: <FaHome />,
        link: "/admin-dashboard",
        exact: true,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Products",
        icon: <FaBox />,
        subMenu: [
          { name: "All Products", link: "/admin-dashboard/all-products" },
          { name: "Add Product", link: "/admin-dashboard/add-product" },
          { name: "Categories", link: "/admin-dashboard/add-category" },
        ],
      },
      {
        name: "Orders",
        icon: <FaShoppingCart />,
        subMenu: [
          { name: "All Orders", link: "/admin-dashboard/orders/management" },
          { name: "Pending", link: "/admin-dashboard/orders/pending" },
          { name: "Completed", link: "/admin-dashboard/orders/completed" },
        ],
      },
      {
        name: "Users",
        icon: <FaUsers />,
        subMenu: [{ name: "Customer List", link: "/admin-dashboard/users" }],
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        name: "Banners",
        icon: <FaLeaf />,
        subMenu: [
          {
            name: "Manage Banners",
            link: "/admin-dashboard/banner-management",
          },
        ],
      },
      {
        name: "Messages",
        icon: <FaEnvelope />,
        subMenu: [{ name: "Inbox", link: "/admin-dashboard/contact-messages" }],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        name: "Settings",
        icon: <FaCog />,
        subMenu: [
          { name: "General", link: "/admin-dashboard/settings" },
          { name: "Integrations", link: "/admin-dashboard/facebook-pixel" },
        ],
      },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();
  const { logOut } = useContext(AuthContext);

  // Auto-expand menu based on active route
  useEffect(() => {
    menuItems.forEach((group, groupIndex) => {
      group.items.forEach((item, itemIndex) => {
        if (item.subMenu) {
          item.subMenu.forEach((sub) => {
            if (location.pathname === sub.link) {
              const uniqueIdx = `${groupIndex}-${itemIndex}`;
              setActiveIndex(uniqueIdx);
            }
          });
        }
      });
    });
  }, [location.pathname]);

  const toggleSubMenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:fixed top-0 left-0 z-50 h-full w-[270px] bg-white text-gray-600 transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-sm
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <span className="text-green-600">BuyNest</span>
              <span className="text-gray-900">Admin</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 transition-colors lg:hidden hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
            {menuItems.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item, itemIdx) => {
                    const uniqueIdx = `${groupIdx}-${itemIdx}`;
                    const isActive = item.link === location.pathname;
                    const isSubActive = activeIndex === uniqueIdx;
                    const hasActiveChild = item.subMenu?.some(
                      (sub) => sub.link === location.pathname
                    );

                    return (
                      <li key={uniqueIdx}>
                        {item.subMenu ? (
                          <div>
                            <button
                              onClick={() => toggleSubMenu(uniqueIdx)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${
                                  isSubActive || hasActiveChild
                                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-lg ${
                                    isSubActive || hasActiveChild
                                      ? "text-green-600"
                                      : "text-gray-400 group-hover:text-gray-600"
                                  }`}
                                >
                                  {item.icon}
                                </span>
                                <span>{item.name}</span>
                              </div>
                              <FaChevronRight
                                className={`w-3 h-3 transition-transform duration-200 ${
                                  isSubActive ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isSubActive
                                  ? "max-h-60 opacity-100 mt-1"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <ul className="pl-3 space-y-1">
                                {item.subMenu.map((sub, subIdx) => (
                                  <li key={subIdx}>
                                    <Link
                                      to={sub.link}
                                      onClick={() =>
                                        window.innerWidth < 1024 &&
                                        toggleSidebar()
                                      }
                                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors
                                        ${
                                          location.pathname === sub.link
                                            ? "text-green-600 bg-green-50 font-medium"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        }
                                      `}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                          location.pathname === sub.link
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                        }`}
                                      ></span>
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.link}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                              ${
                                isActive
                                  ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                          >
                            <span
                              className={`text-lg ${
                                isActive
                                  ? "text-green-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all mb-1"
            >
              <FaArrowLeft />
              <span>Store Front</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
