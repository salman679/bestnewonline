import { useContext } from "react";
import { RiLoaderLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext)
  const location = useLocation();
  const navigate = useNavigate()



  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <RiLoaderLine className="animate-spin text-6xl" />
    </div>
  }


  if (user !== null) {
    return children;
  }

  if (user) return <Navigate to={location.pathname} />;

  navigate("/login", { replace: true });

};

export default PrivateRoute;
