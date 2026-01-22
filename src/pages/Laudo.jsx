import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import BarraPesquisa from "../components/BarraPesquisa";
import ModalErro from "../modals/ModalErro";
import ModalAviso from "../modals/ModalAviso";
import {
  MdPictureAsPdf,
  MdHourglassEmpty,
  MdCheckCircle,
} from "react-icons/md";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // Importação do contexto
import { registrarLog } from "../services/auditService"; // Importação do serviço de log

export default function Laudo() {
  const { usuario: usuarioLogado } = useAuth(); // Obtendo o usuário logado
  const [exames, setExames] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState({
    campo: "data",
    direcao: "desc",
  });
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const navigate = useNavigate();

  // Estados para controle dos Modais
  const [modalStatus, setModalStatus] = useState({
    open: false,
    tipo: "",
    titulo: "",
    mensagem: "",
  });

  const carregarDados = async () => {
    try {
      const res = await api.get("/exames");
      setExames(res || []);

      // LOG: Registro de acesso à Central de Laudos
      const responsavel = usuarioLogado?.nome || "Admin";
      await registrarLog(
        responsavel,
        "Acessou a Central de Laudos",
        "VISUALIZAÇÃO",
      );
    } catch (error) {
      console.error("Erro ao carregar exames:", error);
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Erro de Conexão",
        mensagem:
          "Não foi possível carregar a lista de exames. Tente novamente mais tarde.",
      });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarDataBR = (dataString) => {
    if (!dataString) return "---";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const baixarPDFAnexado = async (exame) => {
    if (exame.pdfArquivo) {
      const link = document.createElement("a");
      link.href = exame.pdfArquivo;
      link.download = `Laudo_${exame.pacienteNome}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // LOG: Registro de download do laudo (Ação de exportação de dado sensível)
      const responsavel = usuarioLogado?.nome || "Admin";
      const detalhes = `Paciente: ${exame.pacienteNome} | Tipo: ${exame.tipo} | ID: ${exame.id}`;
      await registrarLog(
        responsavel,
        `Realizou download de laudo PDF`,
        "EXPORTAÇÃO",
        detalhes,
      );
    } else {
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Arquivo não encontrado",
        mensagem: "O arquivo de laudo PDF não está disponível para este exame.",
      });
    }
  };

  const lidarComCliqueDuplo = (e) => {
    if (e.laudoGerado) {
      setModalStatus({
        open: true,
        tipo: "aviso",
        titulo: "Exame Concluído",
        mensagem: "Este exame já foi concluído. Você pode apenas baixar o PDF.",
      });
      return;
    }
    navigate(`/laudos/analise/${e.id}`, { state: { exame: e } });
  };

  const examesProcessados = exames
    .filter((e) => {
      const termo = pesquisa.toLowerCase();
      return (
        e.pacienteNome?.toLowerCase().includes(termo) ||
        e.tipo?.toLowerCase().includes(termo) ||
        e.pacienteCpf?.includes(termo)
      );
    })
    .sort((a, b) => {
      let valorA = a[ordenacao.campo] || "";
      let valorB = b[ordenacao.campo] || "";
      if (ordenacao.campo === "data") {
        valorA = new Date(a.data);
        valorB = new Date(b.data);
      }
      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1;
      return 0;
    });

  const alterarOrdenacao = (campo) => {
    setOrdenacao((prev) => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc",
    }));
  };

  const fecharModal = () => setModalStatus({ ...modalStatus, open: false });

  return (
    <PageWrapper title="Central de Laudos">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <BarraPesquisa
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            placeholder="Filtrar exames..."
          />
          <div className="text-sm text-slate-500 font-medium">
            {examesProcessados.length} exames encontrados
          </div>
        </div>

        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  className="p-4 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => alterarOrdenacao("pacienteNome")}
                >
                  Paciente
                </th>
                <th
                  className="p-4 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => alterarOrdenacao("tipo")}
                >
                  Exame
                </th>
                <th
                  className="p-4 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => alterarOrdenacao("data")}
                >
                  Data
                </th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examesProcessados.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setItemSelecionado(e.id)}
                  onDoubleClick={() => lidarComCliqueDuplo(e)}
                  className={`transition-colors group cursor-pointer ${
                    itemSelecionado === e.id
                      ? "bg-primary-300 border-l-4 border-l-primary-700"
                      : "hover:bg-primary-300"
                  }`}
                  title={
                    e.laudoGerado
                      ? "Exame Concluído"
                      : "Clique duplo para analisar"
                  }
                >
                  <td className="p-4 font-semibold text-slate-700">
                    {e.pacienteNome}
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {e.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {formatarDataBR(e.data)}
                  </td>
                  <td className="p-4 text-center">
                    {e.laudoGerado ? (
                      <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-xs uppercase">
                        <MdCheckCircle size={18} /> Concluído
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs uppercase">
                        <MdHourglassEmpty size={18} /> Pendente
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {e.laudoGerado ? (
                      <button
                        onClick={(opt) => {
                          opt.stopPropagation();
                          baixarPDFAnexado(e);
                        }}
                        className="bg-primary-300 text-emerald-700 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto hover:bg-primary-400 transition-all shadow-sm cursor-pointer"
                      >
                        <MdPictureAsPdf size={16} /> DOWNLOAD
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">
                        Aguardando análise
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {examesProcessados.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              Nenhum exame encontrado.
            </div>
          )}
        </section>
      </div>

      <ModalErro
        open={modalStatus.open && modalStatus.tipo === "erro"}
        onClose={fecharModal}
        titulo={modalStatus.titulo}
        mensagem={modalStatus.mensagem}
      />

      <ModalAviso
        open={modalStatus.open && modalStatus.tipo === "aviso"}
        onClose={fecharModal}
        titulo={modalStatus.titulo}
        mensagem={modalStatus.mensagem}
      />
    </PageWrapper>
  );
}
