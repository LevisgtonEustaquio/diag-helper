import { useEffect, useState } from "react";
import { MdCancel, MdDeleteOutline, MdEdit, MdEmail, MdPersonAdd, MdSaveAlt } from "react-icons/md";
import BarraPesquisa from "../components/BarraPesquisa";
import BotaoCadastrar from "../components/BotaoCadastrar";
import InputCPF from "../components/InputCPF";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { registrarLog } from "../services/auditService";

export default function CadastroUsuario() {
  const { usuario: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [formAtivo, setFormAtivo] = useState(false);
  const [editId, setEditId] = useState(null);
  const [usuarioOriginal, setUsuarioOriginal] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [pesquisaDebounced, setPesquisaDebounced] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    confirmarEmail: "",
    cargo: "",
    perfil: "",
    status: "Ativo",
  });

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    api.get("/usuarios")
      .then((res) => setUsuarios(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setPesquisaDebounced(pesquisa), 500);
    return () => clearTimeout(handler);
  }, [pesquisa]);

  const usuariosFiltrados = usuarios?.filter((u) => {
    const termo = pesquisaDebounced.toLowerCase();
    const textoBase = `${u.cpf} ${u.nome} ${u.cargo} ${u.status} ${u.perfil} ${u.email}`.toLowerCase();
    return textoBase.includes(termo);
  }) || [];

  const resetForm = () => {
    setForm({ nome: "", cpf: "", email: "", confirmarEmail: "", cargo: "", perfil: "", status: "Ativo" });
    setSenha("");
    setConfirmaSenha("");
    setErroCadastro("");
    setEditId(null);
    setUsuarioOriginal(null);
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    setErroCadastro("");

    if (form.email !== form.confirmarEmail) return setErroCadastro("Os e-mails não coincidem.");
    if (!editId && (senha !== confirmaSenha)) return setErroCadastro("As senhas não coincidem.");

    try {
      const { confirmarEmail, ...dadosParaSalvar } = form;
      dadosParaSalvar.email = dadosParaSalvar.email.toLowerCase();

      if (editId) {
        // --- LÓGICA DE COMPARAÇÃO "DE -> PARA" ---
        const alteracoes = [];
        const camposParaComparar = ['nome', 'cpf', 'email', 'cargo', 'perfil', 'status'];

        camposParaComparar.forEach(campo => {
          const valorAntigo = String(usuarioOriginal[campo] || "Vazio").trim();
          const valorNovo = String(form[campo] || "Vazio").trim();

          if (valorAntigo !== valorNovo) {
            alteracoes.push(`${campo.toUpperCase()}: "${valorAntigo}" → "${valorNovo}"`);
          }
        });

        const res = await api.put(`/usuarios/${editId}`, {
          ...dadosParaSalvar,
          senha: senha || usuarioOriginal.senha
        });

        // Registro do Log com os Detalhes das mudanças
        const responsavel = usuarioLogado?.nome || 'Admin';
        const detalhesTexto = alteracoes.length > 0 ? alteracoes.join(" | ") : "Nenhuma alteração detectada";

        await registrarLog(responsavel, `Editou usuário: ${form.nome}`, "EDIÇÃO", detalhesTexto);

        setUsuarios((prev) => prev.map((u) => (u.id === editId ? res : u)));
      } else {
        // Lógica de Cadastro Novo
        const agora = new Date();
        const criadoEm = `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

        const res = await api.post("/usuarios", {
          ...dadosParaSalvar,
          senha,
          criadoEm
        });
        setUsuarios((prev) => [...prev, res]);

        const responsavel = usuarioLogado?.nome || 'Admin';
        await registrarLog(responsavel, `Cadastrou novo usuário: ${form.nome}`, "CADASTRO");
      }
      resetForm();
      setFormAtivo(false);
    } catch (err) {
      setErroCadastro("Erro ao processar solicitação.");
    }
  };

  const editar = (u) => {
    setForm({ ...u, confirmarEmail: u.email });
    setUsuarioOriginal(u); // Salva o estado atual antes da edição
    setEditId(u.id);
    setFormAtivo(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remover = async (id) => {
    const usuarioRemovido = usuarios.find(u => u.id === id);
    if (window.confirm(`Deseja realmente excluir o usuário ${usuarioRemovido?.nome}?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));

        const responsavel = usuarioLogado?.nome || 'Admin';
        await registrarLog(responsavel, `Excluiu usuário: ${usuarioRemovido?.nome}`, "EXCLUSÃO");
      } catch (err) {
        alert("Erro ao remover usuário.");
      }
    }
  };

  return (
    <PageWrapper title="Gestão de Usuários">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-full md:max-w-md flex items-center gap-3">
            <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} placeholder="Nome, CPF, cargo, e-mail..." />
            {pesquisa !== pesquisaDebounced && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          {!formAtivo && <BotaoCadastrar onClick={() => setFormAtivo(true)} label="Novo Usuário" />}
        </div>

        {formAtivo && (
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdPersonAdd size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">{editId ? "Editar Usuário" : "Novo Usuário do Sistema"}</h2>
            </div>

            <form onSubmit={cadastrar} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputCPF label="CPF" name="cpf" value={form.cpf} onChange={handleChange} required />
              <Input label="Nome Completo" name="nome" value={form.nome} onChange={handleChange} required />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
                <select name="status" className="border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white outline-none transition-all" value={form.status} onChange={handleChange}>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <Input label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
              <Input label="Confirmar E-mail" name="confirmarEmail" type="email" value={form.confirmarEmail} onChange={handleChange} required />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Perfil de Acesso</label>
                <select name="perfil" className="border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white outline-none transition-all" value={form.perfil} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  <option value="recepcao">Recepção</option>
                  <option value="medico">Médico</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cargo</label>
                <select name="cargo" className="border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white outline-none transition-all" value={form.cargo} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Médico Laudista">Médico Laudista</option>
                  <option value="Médico Assistente">Médico Assistente</option>
                  <option value="Médico Generalista">Médico Generalista</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <Input label={editId ? "Nova Senha (opcional)" : "Senha"} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required={!editId} />
              <Input label="Confirme a Senha" type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required={!editId} />

              {erroCadastro && <div className="col-span-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold text-center">{erroCadastro}</div>}

              <div className="col-span-full flex gap-3 pt-6 border-t border-slate-100 mt-2">
                <button type="submit" className="bg-blue-600 text-white rounded-xl flex items-center px-8 py-3 hover:bg-blue-700 transition-all shadow-md font-bold gap-2">
                  <MdSaveAlt size={20} /> {editId ? "Salvar Alterações" : "Confirmar Cadastro"}
                </button>
                <button type="button" onClick={() => { resetForm(); setFormAtivo(false); }} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl hover:bg-slate-200 transition-all font-bold flex items-center gap-2">
                  <MdCancel size={20} /> Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <Th>Usuário</Th>
                  <Th className="hidden lg:table-cell">Cargo / Perfil</Th>
                  <Th className="hidden sm:table-cell">Status</Th>
                  <Th className="text-right">Ações</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <Td>
                      <div className="font-bold text-slate-800">{u.nome}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase"><MdEmail size={12} />{u.email}</div>
                    </Td>
                    <Td className="hidden lg:table-cell">
                      <div className="text-slate-700 text-sm font-medium">{u.cargo}</div>
                      <div className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter italic">{u.perfil}</div>
                    </Td>
                    <Td className="hidden sm:table-cell">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${u.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {u.status}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => editar(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Editar"><MdEdit size={22} /></button>
                        <button onClick={() => remover(u.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Excluir"><MdDeleteOutline size={22} /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

// Subcomponentes auxiliares mantidos
function Input({ label, type = "text", name, ...props }) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input
        type={type}
        name={name}
        className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
        {...props}
      />
    </div>
  );
}

function Th({ children, className = "" }) { return <th className={`px-6 py-4 ${className}`}>{children}</th>; }
function Td({ children, className = "" }) { return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>; }