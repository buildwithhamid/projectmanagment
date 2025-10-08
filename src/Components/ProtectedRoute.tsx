import { Navigate } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { userContextId, loading } = useUserContextId();

  if (loading) return <Loader />;
  if (!userContextId) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
