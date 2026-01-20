import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";
import { MdSave, MdEdit, MdDelete, MdScience, MdVisibility, MdClose, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import api from "../services/api";
import { TIPOS_EXAMES } from "../components/ListaExames";

export default function CadastroExames() {
  const [exames, setExames] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editId, setEditId] = useState(null);
  const [carregandoArquivos, setCarregandoArquivos] = useState(false);
  
  const [arquivosBase64, setArquivosBase64] = useState([]); 
  const [modalArquivos, setModalArquivos] = useState(null); 
  const [indiceArquivoAtual, setIndiceArquivoAtual] = useState(0);

  const [form, setForm] = useState({
    pacienteId: "",
    pacienteNome: "",
    tipo: "",
    data: "", 
    resultado: "",
    arquivos: [], 
    observacoes: "",
  });

  const carregarDados = async () => {
    try {
      const resExames = await api.get("/exames");
      const resPacientes = await api.get("/pacientes");
      setExames(resExames || []);
      setPacientes(resPacientes || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Restrição de tipos: Apenas imagens
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    const arquivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type));
    
    if (arquivosInvalidos.length > 0) {
      alert("Apenas arquivos de imagem (JPEG, JPG e PNG) são permitidos. PDFs não são aceitos.");
      e.target.value = ""; 
      return;
    }

    setCarregandoArquivos(true); 
    let processados = [];

    try {
      for (const file of files) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        processados.push(base64);
      }
      setArquivosBase64(processados);
    } catch (globalError) {
      console.error("Erro no processamento das imagens:", globalError);
      alert("Erro ao carregar os arquivos.");
    } finally {
      setCarregandoArquivos(false); 
    }
  };

  const salvarExame = async (e) => {
    e.preventDefault();
    try {
      const dadosParaSalvar = {
        ...form,
        arquivos: arquivosBase64.length > 0 ? arquivosBase64 : form.arquivos,
        analisado: false,
      };

      if (editId) {
        await api.put(`/exames/${editId}`, dadosParaSalvar);
      } else {
        await api.post("/exames", dadosParaSalvar);
      }

      await carregarDados();
      limparFormulario();
      alert("Exame salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar exame.");
    }
  };

  const limparFormulario = () => {
    setForm({ pacienteId: "", pacienteNome: "", tipo: "", data: "", resultado: "", arquivos: [], observacoes: "" });
    setEditId(null);
    setArquivosBase64([]);
    setMostrarFormulario(false);
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return "---";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  return (
    <PageWrapper title="Exames">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Topo: Pesquisa e Botão Novo */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} />
          {!mostrarFormulario && (
            <BotaoCadastrar label="Cadastrar Exame" onClick={() => setMostrarFormulario(true)} />
          )}
        </div>

        {/* Formulário de Cadastro/Edição */}
        {mostrarFormulario && (
          <section className="bg-white p-6 rounded-2xl shadow border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <MdScience size={24} />
              <h2 className="font-bold text-slate-800">{editId ? "Editar Exame" : "Novo Exame"}</h2>
            </div>

            <form onSubmit={salvarExame} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                required
                value={form.pacienteId}
                onChange={(e) => {
                  const p = pacientes.find(x => String(x.id) === String(e.target.value));
                  if (p) setForm({ ...form, pacienteId: p.id, pacienteNome: p.nome });
                }}
                className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>

              <select
                name="tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                required
                className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tipo de exame</option>
                {TIPOS_EXAMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <input 
                type="date" 
                value={form.data} 
                onChange={(e) => setForm({ ...form, data: e.target.value })} 
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                required 
              />
              
              <input 
                placeholder="Resultado" 
                value={form.resultado} 
                onChange={(e) => setForm({ ...form, resultado: e.target.value })} 
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Anexar Imagens (JPG, PNG)</label>
                <div className="relative">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg,image/png,image/jpg" 
                        onChange={handleFileChange} 
                        className={`w-full border p-3 rounded-xl text-sm ${carregandoArquivos ? 'opacity-50 cursor-wait' : 'bg-slate-50'}`} 
                        disabled={carregandoArquivos}
                    />
                    {carregandoArquivos && <span className="absolute right-3 top-3 text-xs text-blue-600 font-bold animate-pulse">Convertendo...</span>}
                </div>
              </div>

              <textarea placeholder="Observações" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} className="border p-3 rounded-xl col-span-full h-20 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />

              <div className="flex gap-2 col-span-full">
                <button type="submit" disabled={carregandoArquivos} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                  <MdSave size={18} /> {carregandoArquivos ? "Processando..." : "Salvar Exame"}
                </button>
                <button type="button" onClick={limparFormulario} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-300 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tabela de Exames */}
        <section className="bg-white rounded-2xl overflow-hidden shadow border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left text-slate-600 font-bold">Paciente</th>
                <th className="p-4 text-left text-slate-600 font-bold">Exame</th>
                <th className="p-4 text-left text-slate-600 font-bold">Data</th> 
                <th className="p-4 text-center text-slate-600 font-bold">Anexos</th>
                <th className="p-4 text-center text-slate-600 font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exames.filter(e => e.pacienteNome?.toLowerCase().includes(pesquisa.toLowerCase())).map((e) => (
                <tr key={e.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 font-semibold text-slate-700">{e.pacienteNome}</td>
                  <td className="p-4 text-slate-600">{e.tipo}</td>
                  <td className="p-4 text-slate-600">{formatarDataBR(e.data)}</td> 
                  <td className="p-4 text-center">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                      {e.arquivos?.length || 0} fotos
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-4">
                    {e.arquivos?.length > 0 && (
                      <button onClick={() => { setModalArquivos(e.arquivos); setIndiceArquivoAtual(0); }} className="text-emerald-500 hover:scale-110 transition-transform" title="Ver Anexos">
                        <MdVisibility size={22} />
                      </button>
                    )}
                    <button onClick={() => { setForm(e); setEditId(e.id); setArquivosBase64(e.arquivos || []); setMostrarFormulario(true); }} className="text-blue-500 hover:scale-110 transition-transform">
                      <MdEdit size={22} />
                    </button>
                    <button onClick={async () => { if(confirm("Deseja excluir este exame?")) { await api.delete(`/exames/${e.id}`); carregarDados(); } }} className="text-red-400 hover:scale-110 transition-transform">
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exames.length === 0 && <div className="p-10 text-center text-slate-400">Nenhum exame registrado.</div>}
        </section>

        {/* Modal de Visualização de Fotos */}
        {modalArquivos && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-4">
             <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex flex-col">
                    <h3 className="font-bold text-slate-800">Galeria de Exames</h3>
                    <p className="text-xs text-slate-500">Imagem {indiceArquivoAtual + 1} de {modalArquivos.length}</p>
                </div>
                <button onClick={() => setModalArquivos(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><MdClose size={28} /></button>
              </div>
              
              <div className="flex-1 bg-slate-100 flex items-center justify-between relative overflow-hidden">
                <button 
                  disabled={indiceArquivoAtual === 0} 
                  onClick={() => setIndiceArquivoAtual(prev => prev - 1)} 
                  className={`absolute left-4 z-10 p-3 rounded-full bg-white shadow-xl text-slate-800 hover:bg-blue-600 hover:text-white transition-all ${indiceArquivoAtual === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <MdNavigateBefore size={32} />
                </button>

                <div className="w-full h-full flex items-center justify-center p-6">
                    <img src={modalArquivos[indiceArquivoAtual]} alt="Exame" className="max-w-full max-h-full object-contain rounded-lg shadow-lg bg-white" />
                </div>

                <button 
                  disabled={indiceArquivoAtual === modalArquivos.length - 1} 
                  onClick={() => setIndiceArquivoAtual(prev => prev + 1)} 
                  className={`absolute right-4 z-10 p-3 rounded-full bg-white shadow-xl text-slate-800 hover:bg-blue-600 hover:text-white transition-all ${indiceArquivoAtual === modalArquivos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <MdNavigateNext size={32} />
                </button>
              </div>

              <div className="p-4 flex justify-center gap-3 overflow-x-auto bg-white border-t">
                {modalArquivos.map((arq, idx) => (
                  <button key={idx} onClick={() => setIndiceArquivoAtual(idx)} className={`w-16 h-16 rounded-xl border-4 transition-all overflow-hidden flex-shrink-0 ${indiceArquivoAtual === idx ? 'border-blue-500 scale-105 shadow-md' : 'border-slate-100 opacity-60 hover:opacity-100'}`}>
                    <img src={arq} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}