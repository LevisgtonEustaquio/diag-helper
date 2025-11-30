import { useState } from "react";
import {
  House,
  Settings,
  ImagePlus,
  FilePlusCorner,
  History,
  UserPlus,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar({ expanded, setExpanded }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      className={`
        h-screen bg-white shadow-md p-6 z-40 fixed top-0 left-0
        transition-all duration-300 flex flex-col
        ${expanded ? "w-64" : "w-22"}
      `}
    >
      <div className="flex flex-row justify-between">
        {/* Botão expandir */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mb-6 ml-2 cursor-pointer w-2"
        >
          <Menu size={24} />
        </button>

        <img 
        src="/src/assets/icon-diaghelper.svg" 
        alt="Logo da diag helper" 
        className={`
          size-12 mb-6 whitespace-nowrap
          transition-all duration-300
          ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
        `}/>
      </div>
      <nav>
        <ul className="space-y-4 text-slate-900">
          {[
            { to: "/dashboard", icon: House, label: "Dashboard" },
            // { to: "/VisualizarImagens", icon: ImagePlus, label: "Visualizar imagens" },
            { to: "/GerarLaudo", icon: FilePlusCorner, label: "Gerar laudo" },
            {
              to: "/HistoricoLaudos",
              icon: History,
              label: "Histórico de laudos",
            },
            {
              to: "/CadastroPacientes",
              icon: UserPlus,
              label: "Cadastrar paciente",
            },
            {
              to: "/LogisAuditoria",
              icon: FilePlusCorner,
              label: "Logis de Auditoria",
            },
            { to: "/configuracoes", icon: Settings, label: "Configurações" },
          ].map((item, i) => (
            <li key={i}>
              <Link
                to={item.to}
                className="p-2 shadow-lg hover:bg-slate-200 flex flex-row gap-3 rounded-md cursor-pointer items-center"
              >
                <item.icon size={24} className="min-w-6" />

                <span
                  className={`
                    transition-all duration-300 text-nowrap
                    ${
                      expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`mt-auto pt-6 border-t border-slate-300 w-full 
    flex flex-col items-center transition-all duration-300
  `}
      >
        <div
          className={`flex items-center transition-all duration-300 
      ${expanded ? "gap-3 w-full justify-start" : "justify-center"}
    `}
          style={{ minHeight: "60px" }}
        >
          {/* Avatar */}
          <div
            className={`
        rounded-full overflow-hidden shrink-0 flex items-center justify-center
        ${expanded ? "w-10 h-10" : "w-12 h-12"}
      `}
          >
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt="Usuário logado"
              className="inline-block size-8 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
            />
          </div>

          {/* Dados apenas no modo expandido */}
          {expanded && (
            <div className="flex flex-col justify-around gap-2">
              <p className="font-semibold">{usuario.nome}</p>
              <p className="text-sm text-slate-600">{usuario.email}</p>
              <Logout />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      <Navbar expanded={expanded} setExpanded={setExpanded} />

      <main
        className={`
          flex-1 p-6 transition-all duration-300
          ${expanded ? "ml-64" : "ml-20"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
