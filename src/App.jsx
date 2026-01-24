import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";

// Componentes carregados imediatamente (críticos para inicialização)
import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Lazy loading de componentes de páginas
const Login = lazy(() => import("./components/Login"));
const Cadastro = lazy(() => import("./components/Cadastro"));
const SolicitarSenha = lazy(() => import("./pages/SolicitarSenha"));
const Suporte = lazy(() => import("./pages/Suporte"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CadastroPacientes = lazy(() => import("./pages/CadastroPacientes"));
const CadastroExames = lazy(() => import("./pages/CadastroExames"));
const CadastroUsuario = lazy(() => import("./pages/CadastroUsuario"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const Laudo = lazy(() => import("./pages/Laudo"));
const AnaliseExame = lazy(() => import("./pages/AnaliseExame"));
const LogsAuditoria = lazy(() => import("./pages/LogsAuditoria"));
const AdminSolicitacoesSenha = lazy(() => import("./pages/AdminSolicitacoesSuporte"));
const VisualizarImagens = lazy(() => import("./pages/VisualizarImagens"));

// Componente de loading global
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-600 font-medium">Carregando...</p>
      </div>
    </div>
  );
}

function App() {
  const [expanded, setExpanded] = useState(true);

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<Login />} />
          <Route path="/SolicitarSenha" element={<SolicitarSenha />} />
          <Route path="/Suporte" element={<Suporte />} />

          {/* ROTAS PRIVADAS */}
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
            path="/CadastroExames"
            element={
              <PrivateRoute
                perfisPermitidos={["administrador", "medico", "recepcao"]}
              >
                {" "}
                <MainLayout expanded={expanded} setExpanded={setExpanded}>
                  <CadastroExames />
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
            path="/Laudo"
            element={
              <PrivateRoute perfisPermitidos={["administrador", "medico"]}>
                <MainLayout expanded={expanded} setExpanded={setExpanded}>
                  <Laudo />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/laudos/analise/:id"
            element={
              <PrivateRoute perfisPermitidos={["administrador", "medico"]}>
                <MainLayout expanded={expanded} setExpanded={setExpanded}>
                  <AnaliseExame />
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
      </Suspense>
    </AuthProvider>
  );
}

export default App;
