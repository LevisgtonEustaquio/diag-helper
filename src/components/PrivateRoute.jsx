import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, perfisPermitidos }) {
  const { usuario, hasPerfil, loading } = useAuth();

  // Evita redirect prematuro durante carregamento inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (perfisPermitidos && !hasPerfil(perfisPermitidos)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  perfisPermitidos: PropTypes.arrayOf(PropTypes.string),
};
