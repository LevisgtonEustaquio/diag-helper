import {
  FcBusinessman,
  FcClock,
  FcHome,
  FcPlus,
  FcPortraitMode,
  FcSettings,
  FcUnlock,
  FcAddImage
} from "react-icons/fc";
import { Link } from "react-router-dom";
import logoFull from "../assets/6.svg";
import logoIcon from "../assets/icon-diaghelper.svg";
import { useAuth } from "../context/AuthContext";
import Logout from "./Logout";

// DEFINIÇÃO DOS GRUPOS 
const ALL_USERS = ["administrador", "medico", "recepcao"];
const CLINICAL_STAFF = ["administrador", "medico"];
const ADMIN_ONLY = ["administrador"];

const menuItems = [
  { to: "/dashboard", icon: FcHome, label: "Dashboard", roles: ALL_USERS },
  { to: "/Laudo", icon: FcPlus, label: "Laudos", roles: CLINICAL_STAFF },
  { to: "/CadastroUsuario", icon: FcBusinessman, label: "Usuário", roles: ADMIN_ONLY },
  { to: "/CadastroPacientes", icon: FcPortraitMode, label: "Paciente", roles: ALL_USERS },
  { to: "/CadastroExames", icon: FcAddImage, label: "Exames", roles: ALL_USERS },
  { to: "/AdminSolicitacoesSenha", icon: FcUnlock, label: "Suporte", roles: ADMIN_ONLY },
  { to: "/LogsAuditoria", icon: FcClock, label: "Logs de Auditoria", roles: ADMIN_ONLY },
  { to: "/configuracoes", icon: FcSettings, label: "Configurações", roles: ALL_USERS },
];

export default function Navbar({ expanded, setExpanded, mobileOpen, setMobileOpen }) {
  const { usuario, hasPerfil } = useAuth();

  const perfilAtivo = (usuario?.perfil || usuario?.role || "visitante").toLowerCase();

  const avatarPorTipo = {
    recepcao: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80",
    administrador: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=256&q=80",
    medico: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=256&q=80",
  };

  const itensFiltrados = menuItems.filter(item => hasPerfil(item.roles));

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        onMouseEnter={() => window.innerWidth >= 768 && setExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setExpanded(false)}
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl z-40
          transition-all duration-300 flex flex-col overflow-hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${expanded ? "md:w-60 xl:w-64" : "md:w-20"}
        `}
      >
        <div className="flex items-center justify-center h-20 relative shrink-0">
          <img src={logoFull} alt="Logo" className={`h-18 w-auto transition-all duration-300 ${expanded ? "md:opacity-100" : "md:opacity-0 hidden"}`} />
          <img src={logoIcon} alt="Icon" className={`h-10 w-auto transition-all duration-300 ${!expanded ? "md:block md:opacity-100" : "hidden"}`} />
        </div>

        <div className="flex flex-col h-full px-3 pb-4 pt-4 overflow-y-auto no-scrollbar">
          <nav className="flex flex-col items-center w-full space-y-2">
            {itensFiltrados.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center rounded-lg transition-all duration-300 group
                  bg-linear-to-r from-slate-100 to-slate-200 
                  hover:from-primary-200 hover:to-primary-400
                  h-12 w-full
                  ${expanded || mobileOpen ? "px-3 justify-start gap-3" : "px-0 justify-center"}
                `}
              >
                <div className="flex items-center justify-center w-10 h-10 shrink-0">
                  <item.icon size={24} className="transition-transform group-hover:scale-110" />
                </div>
                <span className={`text-sm font-medium text-slate-700 transition-all duration-300 whitespace-nowrap ${expanded || mobileOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-4">
            <div className={`flex items-center h-12 w-full ${expanded ? "px-3 gap-3" : "justify-center"}`}>
              <img src={avatarPorTipo[perfilAtivo] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256"} className="w-10 h-10 rounded-full ring-2 ring-slate-900 object-cover" alt="Avatar" />
              {expanded && (
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold truncate leading-tight">{usuario?.nome}</p>
                  <p className="text-[11px] text-slate-500 truncate">{usuario?.email}</p>
                </div>
              )}
            </div>
            <div className={`flex items-center h-12 w-full ${expanded ? "px-3 gap-3" : "justify-center"}`}>
              <Logout expanded={expanded} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}