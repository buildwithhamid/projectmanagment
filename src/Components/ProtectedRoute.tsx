import { Navigate } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";
import Layout from "../Pages/Layout";
const ProtectedRoute = () => {
  const { userContextId } = useUserContextId();

  if (!userContextId) return <Navigate to="/login" replace />;

  return <Layout />;
};

export default ProtectedRoute;
