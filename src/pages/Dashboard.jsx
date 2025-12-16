import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import DashboardChart from "../components/DashboardChart";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  return (
    <PageWrapper title="Dashboard">
      {/* GRÁFICO DE PIZZA */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Dashboard</h2>
        <DashboardChart usuarios={usuarios} />
      </div>
    </PageWrapper>
  );
}
