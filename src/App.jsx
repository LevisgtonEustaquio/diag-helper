import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import AdminSolicitacoesSenha from "./pages/AdminSolicitacoesSuporte";
import CadastroPacientes from "./pages/CadastroPacientes";
import CadastroExames from "./pages/CadastroExames";
import CadastroUsuario from "./pages/CadastroUsuario";
import Configuracoes from "./pages/Configuracoes";
import Dashboard from "./pages/Dashboard";
import Laudo from "./pages/Laudo";
import AnaliseExame from "./pages/AnaliseExame";
import LogsAuditoria from "./pages/LogsAuditoria";
import SolicitarSenha from "./pages/SolicitarSenha";
import Suporte from "./pages/Suporte";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  const [expanded, setExpanded] = useState(true);

  // Definição padronizada de grupos de acesso para facilitar manutenção
  const ALL_USERS = ["administrador", "medico", "recepcao"];
  const CLINICAL_STAFF = ["administrador", "medico"];
  const ADMIN_ONLY = ["administrador"];

  return (
    <AuthProvider>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/SolicitarSenha" element={<SolicitarSenha />} />
        <Route path="/Suporte" element={<Suporte />} />

        {/* ROTAS PRIVADAS */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute perfisPermitidos={ALL_USERS}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/CadastroPacientes"
          element={
            <PrivateRoute perfisPermitidos={ALL_USERS}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <CadastroPacientes />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/CadastroExames"
          element={
            <PrivateRoute perfisPermitidos={ALL_USERS}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <CadastroExames />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/CadastroUsuario"
          element={
            <PrivateRoute perfisPermitidos={ADMIN_ONLY}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <CadastroUsuario />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Laudo"
          element={
            <PrivateRoute perfisPermitidos={CLINICAL_STAFF}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <Laudo />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/laudos/analise/:id"
          element={
            <PrivateRoute perfisPermitidos={CLINICAL_STAFF}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <AnaliseExame />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/LogsAuditoria"
          element={
            <PrivateRoute perfisPermitidos={ADMIN_ONLY}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <LogsAuditoria />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/AdminSolicitacoesSenha"
          element={
            <PrivateRoute perfisPermitidos={ADMIN_ONLY}>
              <MainLayout expanded={expanded} setExpanded={setExpanded}>
                <AdminSolicitacoesSenha />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Configuracoes"
          element={
            <PrivateRoute perfisPermitidos={ALL_USERS}>
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