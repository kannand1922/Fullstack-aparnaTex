import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;


const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };
  