import { Navigate, Outlet } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";

const ProtectedRoute = () => {
  const { userContextId } = useUserContextId();

  if (!userContextId) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
