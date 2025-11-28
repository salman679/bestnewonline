import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin-Dashboard/sidebar/Sidebar";
import Topbar from "../components/Admin-Dashboard/topbar/Topbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Wrapper */}
      <div className="lg:pl-[270px] flex flex-col min-h-screen transition-all duration-300">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 px-6 pb-6 pt-28 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
