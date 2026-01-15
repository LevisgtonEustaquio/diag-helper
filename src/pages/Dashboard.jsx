import { useEffect, useState } from "react";
import { MdAnalytics, MdCheckCircle, MdPeople, MdPersonOff } from "react-icons/md";
import DashboardChart from "../components/DashboardChart";
import PageWrapper from "../components/PageWrapper";
import api from "../services/api";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/usuarios")
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar usuários:", err);
        setLoading(false);
      });
  }, []);

  // Cálculos para os Cards de Indicadores
  const totalUsuarios = usuarios.length;
  const ativos = usuarios.filter(u => u.status === "Ativo").length;
  const inativos = totalUsuarios - ativos;

  return (
    <PageWrapper title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* CARDS DE INDICADORES (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            title="Total de Usuários"
            value={totalUsuarios}
            icon={<MdPeople size={24} />}
            color="bg-blue-600"
          />
          <StatCard
            title="Usuários Ativos"
            value={ativos}
            icon={<MdCheckCircle size={24} />}
            color="bg-green-600"
          />
          <StatCard
            title="Usuários Inativos"
            value={inativos}
            icon={<MdPersonOff size={24} />}
            color="bg-red-500"
          />
        </div>

        {/* ÁREA DO GRÁFICO */}
        <section className="bg-white p-4 md:p-8 shadow-sm border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <MdAnalytics className="text-slate-400" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Distribuição de Perfis</h2>
          </div>

          <div className="w-full min-h-[300px] flex items-center justify-center">
            {loading ? (
              <div className="animate-pulse text-slate-400">Carregando dados...</div>
            ) : (
              <div className="w-full max-w-2xl mx-auto">
                {/* O componente DashboardChart deve ser responsivo internamente */}
                <DashboardChart usuarios={usuarios} />
              </div>
            )}
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}

/* COMPONENTE INTERNO: Card de Estatística */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}