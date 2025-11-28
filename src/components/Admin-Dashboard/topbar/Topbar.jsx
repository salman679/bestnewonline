import { useContext } from "react";
import { FaBars, FaBell, FaSearch, FaUser } from "react-icons/fa";
import { AuthContext } from "../../../context/auth/AuthContext";

const Topbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[270px] z-40 h-20 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      {/* Left: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <FaBars className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gray-100/50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all w-full max-w-md">
          <FaSearch className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <div className="flex gap-1">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-gray-500 bg-white border border-gray-200 rounded shadow-sm">
              ⌘
            </kbd>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-gray-500 bg-white border border-gray-200 rounded shadow-sm">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <button className="relative p-2.5 text-gray-500 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-700">
          <FaBell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold leading-none text-gray-900">
              {user?.displayName || user?.Database?.fullName || "Admin User"}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500">
              {user?.Database?.role || "Administrator"}
            </p>
          </div>
          <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden text-white bg-green-600 rounded-full shadow-sm ring-2 ring-white cursor-pointer hover:ring-green-100 transition-all">
            {user?.photoURL || user?.Database?.profilePic ? (
              <img
                src={user?.photoURL || user?.Database?.profilePic}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm font-bold">
                {(user?.displayName || "A").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
