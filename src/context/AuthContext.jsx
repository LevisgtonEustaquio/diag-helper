import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("usuario");
            if (raw) setUsuario(JSON.parse(raw));
        } catch {
            setUsuario(null);
        }
    }, []);

    const login = (userObj) => {
        setUsuario(userObj);
        try { localStorage.setItem("usuario", JSON.stringify(userObj)); } catch { }
    };

    const logout = () => {
        setUsuario(null);
        try { localStorage.removeItem("usuario"); } catch { }
    };

    const hasPerfil = (perfisPermitidos) => {
        if (!usuario) return false;
        const perfil = usuario.perfil || usuario.role || usuario.tipoUsuario;
        if (!perfil) return false;
        return Array.isArray(perfisPermitidos)
            ? perfisPermitidos.includes(perfil)
            : true;
    };

    const value = useMemo(() => ({ usuario, login, logout, hasPerfil }), [usuario]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado com AuthProvider");
    return ctx;
}
