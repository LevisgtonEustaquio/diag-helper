import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PageWrapper from "../components/PageWrapper";
import { MdPeople, MdCheckCircle, MdCancel, MdLockReset } from "react-icons/md";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

const data = [
  { name: "Total de Usuários", value: 5, icon: <MdPeople /> },
  { name: "Usuários Ativos", value: 3, icon: <MdCheckCircle /> },
  { name: "Usuários Inativos", value: 2, icon: <MdCancel /> },
  { name: "Tickets", value: 2, icon: <MdLockReset /> },
];

export default function Dashboard() {
  return (
    <PageWrapper title="Visão Geral">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* INDICADORES (KPIs) - Grid Adaptável */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((card, index) => (
            <div
              key={card.name}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3 transition-all hover:shadow-md min-w-0"
            >
              {/* shrink-0 impede que o ícone seja esmagado pelo texto longo */}
              <div
                className="p-3 rounded-xl text-white shadow-sm shrink-0"
                style={{ backgroundColor: COLORS[index] }}
              >
                {React.cloneElement(card.icon, { size: 20 })}{" "}
                {/* Reduzi para 20 para ganhar espaço */}
              </div>

              {/* min-w-0 permite que o container de texto entenda o limite do pai */}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-tight break-words">
                  {card.name}
                </p>
                <p className="text-xl font-black text-slate-900 truncate">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ÁREA DO GRÁFICO E RESUMO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* GRÁFICO COM CONTAINER RESPONSIVO */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full"></span>
              Distribuição de Usuários
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LISTA DE RESUMO ESTILIZADA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Detalhamento
            </h2>
            <div className="space-y-4">
              {data.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-slate-700 font-semibold uppercase text-xs tracking-wider">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
