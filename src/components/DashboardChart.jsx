import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#E7E9ED",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
];

const data = [
  { name: "Total de Usuários", value: 40 },
  { name: "Ativos", value: 25 },
  { name: "Inativos", value: 15 },
  { name: "Solicitações Senhas", value: 10 },
 
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
     

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10 bg-gray-200 ">
        {[
          { title: "Total de Usuários", value: "5" },
          { title: "Ativos", value: "3" },
          { title: "Inativos", value: "2" },
          { title: "Solicitações Senhas", value: "2" },
         
        ].map((card) => (
          <div
            key={card.title}
            className="border rounded p-4 shadow text-center"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="font-bold text-lg">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico + Legenda */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Legenda customizada */}
        <div className="flex-1 overflow-auto max-h-[400px]">
          <h2 className="font-semibold mb-4">Resumo</h2>
          <ul className="space-y-2">
            {data.map((entry, index) => (
              <li key={entry.name} className="flex items-center space-x-3">
                <span
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-gray-700">{entry.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
