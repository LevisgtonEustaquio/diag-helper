import { useEffect, useState } from "react";
import Layout from "../components/Navbar";

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregarLogs() {
      const resposta = await fetch("http://localhost:3000/logsAuditoria");
      const dados = await resposta.json();
      setLogs(dados);
    }

    carregarLogs();
  }, []);

  const logsFiltrados = logs.filter((log) => {
    const texto = pesquisa.toLowerCase();
    const correspondePesquisa =
      log.usuario?.toLowerCase().includes(texto) ||
      log.acao?.toLowerCase().includes(texto);

    const correspondeFiltro = filtro ? log.tipo === filtro : true;

    return correspondePesquisa && correspondeFiltro;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Logs de Auditoria
        </h1>

        {/* filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Pesquisar usuário ou ação..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-sm w-full md:w-60 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todos os tipos</option>
            <option value="LOGIN">Login</option>
            <option value="CADASTRO">Cadastro</option>
            <option value="EDIÇÃO">Edição</option>
            <option value="EXCLUSÃO">Exclusão</option>
            <option value="EXAME">Exame</option>
          </select>
        </div>

        {/* tabela */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Usuário</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Data</th>
                <th className="p-4">IP</th>
              </tr>
            </thead>

            <tbody>
              {logsFiltrados.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan="5">
                    Nenhum log encontrado.
                  </td>
                </tr>
              ) : (
                logsFiltrados.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {log.usuario}
                    </td>
                    <td className="p-4 text-gray-700">{log.acao}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {log.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(log.data).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-4 text-gray-600">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
