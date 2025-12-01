import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("logsAuditoria")) || [];
    setLogs(dados);
  }, []);

  const logsFiltrados = logs.filter((log) => {
    const texto = pesquisa.toLowerCase();
    const correspondePesquisa =
      log.usuario.toLowerCase().includes(texto) ||
      log.acao.toLowerCase().includes(texto);

    const correspondeFiltro = filtro ? log.tipo === filtro : true;

    return correspondePesquisa && correspondeFiltro;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="pt-24 p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Logs de Auditoria</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Pesquisar por usuário ou ação..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border p-2 rounded w-48"
          >
            <option value="">Todos os tipos</option>
            <option value="LOGIN">Login</option>
            <option value="CADASTRO">Cadastro</option>
            <option value="EDIÇÃO">Edição</option>
            <option value="EXCLUSÃO">Exclusão</option>
            <option value="EXAME">Exame</option>
          </select>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-left">Ação</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">IP</th>
              </tr>
            </thead>

            <tbody>
              {logsFiltrados.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan="5">
                    Nenhum log encontrado.
                  </td>
                </tr>
              ) : (
                logsFiltrados.map((log, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{log.usuario}</td>
                    <td className="p-3">{log.acao}</td>
                    <td className="p-3">{log.tipo}</td>
                    <td className="p-3">
                      {new Date(log.data).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
