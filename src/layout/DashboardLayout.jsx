import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Admin-Dashboard/sidebar/Sidebar";
import { FaBars, FaTimes, FaBell, FaUser } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";

const DashboardLayout = () => {
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const { user } = useContext(AuthContext);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = (index) => {
    setSubMenuOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="fixed z-[60] top-0 left-0 right-0 h-16 bg-white shadow-sm ">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              {isOpen ? (
                <FaTimes className=" cursor-pointer  w-6 h-6 text-gray-600" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {pathname.replace("-", " ")}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <FaBell className="w-5 h-5 text-gray-600" />

              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bgColor flex items-center justify-center text-white">
                {user?.Database?.fullName?.[0]?.toUpperCase() || <img src={user?.Database?.profilePic} alt="" className="w-5 h-5 rounded-full" />}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.Database?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.Database?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          toggleSubMenu={toggleSubMenu}
          subMenuOpen={subMenuOpen}
        />

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 overflow-y-auto `}>
          <div className="p-6 max-[640px]:p-2">


            {/* Content Container */}
            <div className="bg-white h-screen rounded-xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;