import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("usuario");
            if (raw) setUsuario(JSON.parse(raw));
        } catch (error) {
            console.error("Erro ao carregar usuário do localStorage:", error);
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((userObj) => {
        setUsuario(userObj);
        try {
            localStorage.setItem("usuario", JSON.stringify(userObj));
        } catch (error) {
            console.error("Erro ao salvar usuário no localStorage:", error);
        }
    }, []);

    const logout = useCallback(() => {
        setUsuario(null);
        try {
            localStorage.removeItem("usuario");
        } catch (error) {
            console.error("Erro ao remover usuário do localStorage:", error);
        }
    }, []);

    const hasPerfil = useCallback((perfisPermitidos) => {
        if (!usuario) return false;
        const perfil = usuario.perfil || usuario.role || usuario.tipoUsuario;
        if (!perfil) return false;
        return Array.isArray(perfisPermitidos)
            ? perfisPermitidos.includes(perfil)
            : true;
    }, [usuario]);

    const value = useMemo(() => ({
        usuario,
        login,
        logout,
        hasPerfil,
        loading
    }), [usuario, login, logout, hasPerfil, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado com AuthProvider");
    return ctx;
}
