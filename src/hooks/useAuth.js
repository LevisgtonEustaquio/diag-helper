import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook para acessar o contexto de autenticação
 * @returns {Object} Contexto de autenticação com { usuario, login, logout, hasPerfil, loading }
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado com AuthProvider");
    return ctx;
}
