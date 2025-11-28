import { RiLoaderLine } from "react-icons/ri";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";
import { useContext } from "react";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RiLoaderLine className="animate-spin text-6xl" />
      </div>
    );
  }

  if (user?.role === "admin") {
    return children;
  }

  return <Navigate to="/login" state={location.pathname} />;
};

export default AdminRoute;
