import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Cadastro from "./components/Cadastro";
import Login from "./components/Login";
import AdminSolicitacoesSenha from "./pages/AdminSolicitacoesSuporte";
import CadastroPacientes from "./pages/CadastroPacientes";
import CadastroUsuario from "./pages/CadastroUsuario";
import Configuracoes from "./pages/Configuracoes";
import Dashboard from "./pages/Dashboard";
import GerarLaudo from "./pages/GerarLaudo";
import LogsAuditoria from "./pages/LogsAuditoria";
import SolicitarSenha from "./pages/SolicitarSenha";
import Suporte from "./pages/Suporte";
import VisualizarImagens from "./pages/VisualizarImagens";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  const [expanded, setExpanded] = useState(true);

  return (
    <AuthProvider>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/SolicitarSenha" element={<SolicitarSenha />} />
        <Route path="/Suporte" element={<Suporte />} />

        {/* 🔒 ROTAS PRIVADAS */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              perfisPermitidos={["administrador", "medico", "recepcionista"]}
            >
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Cadastro"
          element={
            <MainLayout expanded={expanded} setExpanded={setExpanded}>
              <Cadastro />
            </MainLayout>
          }
        />

        <Route
          path="/CadastroPacientes"
          element={
            <PrivateRoute
              perfisPermitidos={["administrador", "medico", "recepcionista"]}
            >
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <CadastroPacientes />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/CadastroUsuario"
          element={
            <PrivateRoute perfisPermitidos={["administrador"]}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <CadastroUsuario />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/VisualizarImagens"
          element={
            <MainLayout expanded={expanded} setExpanded={setExpanded}>
              <VisualizarImagens />
            </MainLayout>
          }
        />

        <Route
          path="/GerarLaudo"
          element={
            <PrivateRoute perfisPermitidos={["administrador", "medico"]}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <GerarLaudo />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/LogsAuditoria"
          element={
            <PrivateRoute perfisPermitidos={["administrador"]}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <LogsAuditoria />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/AdminSolicitacoesSenha"
          element={
            <PrivateRoute perfisPermitidos={["administrador"]}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <AdminSolicitacoesSenha />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Configuracoes"
          element={
            <PrivateRoute
              perfisPermitidos={["administrador", "medico", "recepcionista"]}
            >
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <Configuracoes />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;