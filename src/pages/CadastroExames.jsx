import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";
import ModalErro from "../modals/ModalErro";
import ModalAviso from "../modals/ModalAviso";
import ModalForm from "../modals/ModalForm"; // Novo componente de moldura
import FormularioExame from "../components/FormularioExame"; // Componente com os campos
import ModalGaleria from "../modals/ModalGaleria";
import {
  MdEdit,
  MdDelete,
  MdScience,
  MdVisibility,
  MdClose,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { registrarLog } from "../services/auditService";

export default function CadastroExames() {
  const { usuario } = useAuth();
  const [exames, setExames] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [exameParaEditar, setExameParaEditar] = useState(null);

  // Estados da Galeria (Originais)
  const [modalArquivos, setModalArquivos] = useState(null);
  const [indiceArquivoAtual, setIndiceArquivoAtual] = useState(0);

  // Controle de Modais de Feedback
  const [modalStatus, setModalStatus] = useState({
    open: false,
    tipo: "",
    titulo: "",
    mensagem: "",
  });

  const nomeOperador = usuario?.nome || "Operador";

  const carregarDados = async () => {
    try {
      const [resExames, resPacientes] = await Promise.all([
        api.get("/exames"),
        api.get("/pacientes")
      ]);
      setExames(resExames || []);
      setPacientes(resPacientes || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const salvarExame = async (dados) => {
    try {
      const payload = { ...dados, analisado: false };
      
      if (exameParaEditar) {
        await api.put(`/exames/${exameParaEditar.id}`, payload);
        await registrarLog(
          nomeOperador, 
          `Editou exame de: ${dados.pacienteNome}`, 
          "ALTERAÇÃO", 
          `ID: ${exameParaEditar.id} | Tipo: ${dados.tipo}`
        );
      } else {
        await api.post("/exames", payload);
        await registrarLog(
          nomeOperador, 
          `Cadastrou novo exame: ${dados.tipo}`, 
          "CADASTRO", 
          `Paciente: ${dados.pacienteNome}`
        );
      }

      await carregarDados();
      setMostrarFormulario(false);
      setExameParaEditar(null);
      setModalStatus({
        open: true,
        tipo: "aviso",
        titulo: "Operação Concluída",
        mensagem: exameParaEditar ? "As alterações foram salvas!" : "Novo exame cadastrado com sucesso!",
      });
    } catch (error) {
      setModalStatus({ 
        open: true, 
        tipo: "erro", 
        titulo: "Erro de Sistema", 
        mensagem: "Falha na comunicação com o servidor." 
      });
    }
  };

  const deletarExame = async (id, nomePaciente) => {
    if (window.confirm(`ATENÇÃO: Deseja excluir permanentemente o exame de ${nomePaciente}?`)) {
      try {
        await api.delete(`/exames/${id}`);
        await registrarLog(
          nomeOperador, 
          `Excluiu exame do paciente: ${nomePaciente}`, 
          "EXCLUSÃO", 
          `ID deletado: ${id}`
        );
        carregarDados();
      } catch (error) {
        setModalStatus({ 
          open: true, 
          tipo: "erro", 
          titulo: "Erro ao Excluir", 
          mensagem: "Não foi possível remover o registro." 
        });
      }
    }
  };

  const abrirVisualizacao = async (exame) => {
    setModalArquivos(exame.arquivos);
    setIndiceArquivoAtual(0);
    await registrarLog(
      nomeOperador,
      `Acessou galeria de imagens: ${exame.pacienteNome}`,
      "VISUALIZAÇÃO"
    );
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return "---";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <PageWrapper title="Gestão de Exames">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Barra Superior */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <BarraPesquisa 
            pesquisa={pesquisa} 
            setPesquisa={setPesquisa} 
            placeholder="Filtrar por nome do paciente..." 
          />
          <BotaoCadastrar 
            label="Novo Exame" 
            onClick={() => { setExameParaEditar(null); setMostrarFormulario(true); }} 
          />
        </div>

        {/* MODAL DO FORMULÁRIO (Componente Reutilizável) */}
        <ModalForm
          isOpen={mostrarFormulario}
          onClose={() => { setMostrarFormulario(false); setExameParaEditar(null); }}
          title={exameParaEditar ? "Editar Registro de Exame" : "Novo Cadastro de Exame"}
          icon={MdScience}
        >
          <FormularioExame 
            pacientes={pacientes}
            exameParaEditar={exameParaEditar}
            onSalvar={salvarExame}
            onCancelar={() => { setMostrarFormulario(false); setExameParaEditar(null); }}
            setModalStatus={setModalStatus}
          />
        </ModalForm>

        {/* TABELA DE LISTAGEM (Estilização Original Mantida) */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-slate-600 font-bold">Paciente</th>
                  <th className="p-4 text-slate-600 font-bold">Tipo de Exame</th>
                  <th className="p-4 text-slate-600 font-bold">Data</th>
                  <th className="p-4 text-center text-slate-600 font-bold">Imagens</th>
                  <th className="p-4 text-center text-slate-600 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exames
                  .filter(e => e.pacienteNome?.toLowerCase().includes(pesquisa.toLowerCase()))
                  .map((e) => (
                    <tr key={e.id} className="hover:bg-primary-50/30 transition-colors group">
                      <td className="p-4 font-semibold text-slate-700">{e.pacienteNome}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs uppercase font-medium">
                          {e.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatarDataBR(e.data)}</td>
                      <td className="p-4 text-center">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold border border-primary-100">
                          {e.arquivos?.length || 0} anexo(s)
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-4">
                           {e.arquivos?.length > 0 && (
                             <button onClick={() => abrirVisualizacao(e)} className="text-emerald-500 hover:scale-120 transition-transform cursor-pointer" title="Ver Imagens">
                               <MdVisibility size={22} />
                             </button>
                           )}
                           <button onClick={() => { setExameParaEditar(e); setMostrarFormulario(true); }} className="text-blue-500 hover:scale-120 transition-transform cursor-pointer" title="Editar">
                             <MdEdit size={22}/>
                           </button>
                           <button onClick={() => deletarExame(e.id, e.pacienteNome)} className="text-red-400 hover:scale-120 transition-transform cursor-pointer" title="Excluir">
                             <MdDelete size={22}/>
                           </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          {exames.length === 0 && (
            <div className="p-20 text-center">
              <MdScience size={48} className="mx-auto text-slate-200 mb-2" />
              <p className="text-slate-400">Nenhum exame encontrado.</p>
            </div>
          )}
        </section>
      </div>

      <ModalGaleria 
  isOpen={!!modalArquivos} 
  imagens={modalArquivos} 
  indiceAtual={indiceArquivoAtual} 
  setIndice={setIndiceArquivoAtual} 
  onClose={() => setModalArquivos(null)} 
/>

      {/* Modais de Feedback */}
      <ModalErro open={modalStatus.open && modalStatus.tipo === "erro"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
      <ModalAviso open={modalStatus.open && modalStatus.tipo === "aviso"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
    </PageWrapper>
  );
}