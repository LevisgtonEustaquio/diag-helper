import { useEffect, useState } from "react";
import {
  MdFileDownload,
  MdFilterList,
  MdHistory,
  MdSearch,
} from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../services/api";

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregarLogs() {
      try {
        const dados = await api.get("/LogsAuditoria");

        const dadosOrdenados = Array.isArray(dados)
          ? dados.sort((a, b) => new Date(b.data) - new Date(a.data))
          : [];

        setLogs(dadosOrdenados);
      } catch (error) {
        console.error("Erro ao carregar logs:", error);
      }
    }
    carregarLogs();
  }, []);

  // --- LÓGICA DE EXPORTAÇÃO CSV ---
  const exportarCSV = () => {
    if (logsFiltrados.length === 0) return;

    // Cabeçalho do CSV
    const cabecalho = ["Data", "Usuario", "Acao", "Tipo", "Detalhes", "IP"];

    // Formata as linhas
    const linhas = logsFiltrados.map((log) => [
      new Date(log.data).toLocaleString("pt-BR"),
      log.usuario,
      `"${log.acao?.replace(/"/g, '""')}"`, // Escapa aspas
      log.tipo,
      `"${log.detalhes?.replace(/"/g, '""') || ""}"`, // Inclui detalhes no CSV
      log.ip || "127.0.0.1",
    ]);

    // Une tudo com ponto e vírgula (padrão Excel Brasil)
    const csvContent = [cabecalho, ...linhas]
      .map((e) => e.join(";"))
      .join("\n");

    // Cria o download
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `auditoria_diag_helper_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logsFiltrados = logs.filter((log) => {
    const texto = pesquisa.toLowerCase();
    const correspondePesquisa =
      log.usuario?.toLowerCase().includes(texto) ||
      log.acao?.toLowerCase().includes(texto) ||
      log.detalhes?.toLowerCase().includes(texto);

    const correspondeFiltro = filtro ? log.tipo === filtro : true;
    return correspondePesquisa && correspondeFiltro;
  });

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case "LOGIN":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "LAUDO":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "EXCLUSÃO":
        return "bg-red-100 text-red-700 border-red-200";
      case "CADASTRO":
        return "bg-green-100 text-green-700 border-green-200";
      case "EDIÇÃO":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "INFO":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "ERRO":
        return "bg-red-600 text-white border-red-700";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <PageWrapper title="Logs de Auditoria">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* CABEÇALHO DE AÇÕES */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            Visualizando{" "}
            <span className="font-bold text-slate-800">
              {logsFiltrados.length}
            </span>{" "}
            eventos registrados.
          </p>

          <button
            onClick={exportarCSV}
            disabled={logsFiltrados.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <MdFileDownload size={20} />
            Exportar CSV
          </button>
        </div>

        {/* FILTROS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquisar usuário ou ação..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <MdFilterList
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full sm:w-60 pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">Todos os tipos</option>
              <option value="LAUDO">📄 Laudos Gerados</option>
              <option value="LOGIN">🔑 Logins</option>
              <option value="CADASTRO">📝 Cadastros</option>
              <option value="EDIÇÃO">✏️ Edições</option>
              <option value="EXCLUSÃO">🗑️ Exclusões</option>
              <option value="ERRO">🚨 Erros</option>
            </select>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <Th>Evento</Th>
                  <Th className="hidden md:table-cell">Tipo</Th>
                  <Th className="hidden sm:table-cell">Data e Hora</Th>
                  <Th className="hidden lg:table-cell text-right">
                    Endereço IP
                  </Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {logsFiltrados.length === 0 ? (
                  <tr>
                    <td
                      className="p-12 text-center text-slate-400 italic"
                      colSpan="4"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <MdHistory size={40} className="text-slate-200" />
                        <p>Nenhum log encontrado para esta busca.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logsFiltrados.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <Td>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-800">
                            {log.usuario}
                          </span>
                          <span className="text-slate-600 text-xs md:text-sm">
                            {log.acao}
                          </span>

                          {/* EXIBIÇÃO DO ESTADO ORIGINAL E NOVO (DE -> PARA) */}
                          {log.detalhes && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] font-mono text-amber-800 leading-relaxed max-w-xl">
                              <span className="font-bold uppercase block mb-0.5">
                                Alterações detalhadas:
                              </span>
                              {log.detalhes}
                            </div>
                          )}

                          <div className="md:hidden mt-2">
                            <Badge
                              tipo={log.tipo}
                              colorClass={getBadgeColor(log.tipo)}
                            />
                          </div>
                        </div>
                      </Td>
                      <Td className="hidden md:table-cell">
                        <Badge
                          tipo={log.tipo}
                          colorClass={getBadgeColor(log.tipo)}
                        />
                      </Td>
                      <Td className="hidden sm:table-cell text-slate-500 font-mono text-xs">
                        {log.data
                          ? new Date(log.data).toLocaleString("pt-BR")
                          : "---"}
                      </Td>
                      <Td className="hidden lg:table-cell text-right text-slate-400 font-mono text-xs">
                        {log.ip || "127.0.0.1"}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTES INTERNOS */
function Th({ children, className = "" }) {
  return (
    <th
      className={`p-4 text-xs uppercase tracking-wider font-bold text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`p-4 align-top ${className}`}>{children}</td>;
}

function Badge({ tipo, colorClass }) {
  return (
    <span
      className={`px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-tight ${colorClass}`}
    >
      {tipo}
    </span>
  );
}
