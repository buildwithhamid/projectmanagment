import { Navigate, Outlet } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const { userContextId, loading } = useUserContextId();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full pt-80">
        <Loader />
      </div>
    );
  }

  if (!userContextId) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
