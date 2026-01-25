import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, perfisPermitidos }) {
  const { usuario, hasPerfil } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (perfisPermitidos && !hasPerfil(perfisPermitidos)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
