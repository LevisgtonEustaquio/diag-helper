import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./components/Cadastro";
import CadastroPacientes from "./pages/CadastroPacientes";
import CadastroUsuario from "./pages/CadastroUsuario";
import VisualizarImagens from "./pages/VisualizarImagens";
import GerarLaudo from "./pages/GerarLaudo";
import Configuracoes from "./pages/Configuracoes";
import HistoricoLaudos from "./pages/HistoricoLaudos";
import LogsAuditoria from "./pages/LogsAuditoria";
import Suporte from "./pages/Suporte";
import PrivateRoute from "./components/PrivateRoute"
import MainLayout from "./components/MainLayout";
import "./index.css";

function App() {
  // controla o expandir/retrair da sidebar
  const [expanded, setExpanded] = useState(true);

   return (
    <Routes>
      {/* Página sem layout */}
      <Route path="/" element={<Login />} />

      <Route path="/Suporte" element={<Suporte />} />

      {/* Páginas com layout */}
     <Route
      path="/dashboard"
      element={
    <PrivateRoute perfisPermitidos={["administrador", "medico", "recepcao"]}>
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
    <PrivateRoute perfisPermitidos={["administrador", "medico", "recepcao"]}>
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
  path="/Configuracoes"
  element={
    <PrivateRoute perfisPermitidos={["administrador", "medico", "recepcao"]}>
      <MainLayout expanded={expanded} setExpanded={setExpanded}>
        <Configuracoes />
      </MainLayout>
    </PrivateRoute>
  }
/>


      <Route
        path="/Suporte"
        element={
          <MainLayout expanded={expanded} setExpanded={setExpanded}>
            <Suporte />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
