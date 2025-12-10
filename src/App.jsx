import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./components/Cadastro";
import CadastroPacientes from "./pages/CadastroPacientes";
import VisualizarImagens from "./pages/VisualizarImagens";
import GerarLaudo from "./pages/GerarLaudo";
import Configuracoes from "./pages/Configuracoes";
import HistoricoLaudos from "./pages/HistoricoLaudos";

import "./index.css";
import LogsAuditoria from "./pages/LogsAuditoria";
import Suporte from "./pages/Suporte";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/CadastroPacientes" element={<CadastroPacientes />} />
      <Route path="/VisualizarImagens" element={<VisualizarImagens />} />
      <Route path="/GerarLaudo" element={<GerarLaudo />} />
      <Route path="/LogsAuditoria" element={<LogsAuditoria />} />
      <Route path="/Configuracoes" element={<Configuracoes />} />

      {/* <Route path="/ConsultarUsuario" element={<ConsultarUsuario/>}></Route> */}
      <Route path="/suporte" element={<Suporte />} />
    </Routes>
  );
}

export default App;
