import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem("usuario");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (raw && !usuario) {
      setUsuario(JSON.parse(raw));
    }
  }, [usuario]);

  const login = (userObj) => {
    setUsuario(userObj);
    try {
      localStorage.setItem("usuario", JSON.stringify(userObj));
    } catch {}
  };

  const logout = () => {
    setUsuario(null);
    try {
      localStorage.removeItem("usuario");
    } catch {}
  };

  // const hasPerfil = (perfisPermitidos) => {
  //   if (!usuario) return false;
  //   const perfil = usuario.perfil || usuario.role || usuario.tipoUsuario;
  //   if (!perfil) return false;
  //   return Array.isArray(perfisPermitidos)
  //     ? perfisPermitidos.includes(perfil)
  //     : true;
  // };

  const hasPerfil = (perfisPermitidos) => {
    if (!usuario) return false;

    // Pega o perfil do usuário e limpa (ex: de "Recepção" para "recepcao")
    const perfilUsuario = (usuario.perfil || usuario.role || usuario.tipoUsuario || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (!perfilUsuario) return false;

    // Limpa a lista de perfis permitidos e verifica se o usuário está nela
    const perfisLimpis = perfisPermitidos.map(p => 
        p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    return perfisLimpis.includes(perfilUsuario);
};

  const value = useMemo(
    () => ({ usuario, login, logout, hasPerfil }),
    [usuario],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado com AuthProvider");
  return ctx;
}
