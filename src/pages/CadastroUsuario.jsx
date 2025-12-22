import { useState, useEffect } from "react";
import { MdSaveAlt } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import BarraPesquisa from "../components/BarraPesquisa";
import BotaoCadastrar from "../components/BotaoCadastrar";

export default function CadastroUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formAtivo, setFormAtivo] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("medicoAssistente");
  const [erroCadastro, setErroCadastro] = useState("");

  const [perfis, setPerfis] = useState({
    recepcionista: false,
    medicoAssistente: false,
    medicoLaudista: false,
    administrador: false,
  });

  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch(console.error);
  }, []);

  const gerarDataHora = () => {
    const agora = new Date();
    return `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const resetForm = () => {
    setForm({ nome: "", cpf: "", cargo: "", status: "Ativo" });
    setSenha("");
    setConfirmaSenha("");
    setTipoUsuario("medicoAssistente");
    setPerfis({
      recepcionista: false,
      medicoAssistente: false,
      medicoLaudista: false,
      administrador: false,
    });
    setErroCadastro("");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerfis((prev) => ({ ...prev, [name]: checked }));
  };

  const cadastrar = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setErroCadastro("As senhas não coincidem.");
      return;
    }

    const novoUsuario = {
      ...form,
      senha,
      tipoUsuario,
      perfis,
      criadoEm: gerarDataHora(),
    };

    const res = await fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario),
    });

    const usuarioSalvo = await res.json();
    setUsuarios((prev) => [...prev, usuarioSalvo]);

    resetForm();
    setFormAtivo(false);
  };

  const remover = async (id) => {
    await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = `
      ${u.cpf}  
      ${u.nome}
      ${u.cargo}
      ${u.status}
      ${Object.entries(u.perfis || {})
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(" ")}
    `.toLowerCase();

    return texto.includes(pesquisa.toLowerCase());
  });

  return (
    <PageWrapper title="Usuários">
      {/* TOPO: PESQUISA + BOTÃO */}
      <div className="flex flex-col gap-2 mb-4 items-start">
        {/* Barra de pesquisa limitada */}
        <div className="w-full max-w-md">
          <BarraPesquisa
            value={pesquisa}
            onChange={setPesquisa}
            placeholder="🔍 Pesquisar por nome, CPF, cargo ou perfil"
          />
        </div>

        {/* Botão limitado */}
        {!formAtivo && (
          <div className="w-full max-w-xs">
            <BotaoCadastrar onClick={() => setFormAtivo(true)} />
          </div>
        )}
      </div>

      {/* FORMULÁRIO */}
      {formAtivo && (
        <section className="bg-white p-4 shadow rounded mb-6">
          <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>

          <form
            onSubmit={cadastrar}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Input
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            />

            <Input
              label="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <Input
              label="Cargo"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            />

            <select
              className="border p-2 rounded w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <Input
              label="Confirme a Senha"
              type="password"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
            />

            <select
              className="border p-2 rounded w-full"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="medicoAssistente">Médico Assistente</option>
              <option value="medicoLaudista">Médico Laudista</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="administrador">Administrador</option>
            </select>

            <div className="flex flex-col justify-center">
              <p className="font-semibold mb-1 text-sm">Perfis</p>
              <div className="flex flex-wrap gap-4">
                {[
                  ["recepcionista", "Recepcionista"],
                  ["medicoAssistente", "Médico Assistente"],
                  ["medicoLaudista", "Médico Laudista"],
                  ["administrador", "Administrador"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={key}
                      checked={perfis[key]}
                      onChange={handleCheckboxChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {erroCadastro && (
              <p className="text-red-500 text-sm col-span-2">{erroCadastro}</p>
            )}

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-gray-400 text-black rounded flex items-center px-4 py-2 hover:bg-gray-600"
              >
                <MdSaveAlt size={16} className="mr-2" />
                Salvar
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormAtivo(false);
                }}
                className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TABELA */}
      <section className="bg-white p-4 shadow rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <Th>CPF</Th>
                <Th>Nome</Th>
                <Th>Cargo</Th>
                <Th>Status</Th>
                <Th>Perfis</Th>
                <Th>Criado em</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-b">
                  <Td>{u.cpf}</Td>
                  <Td>{u.nome}</Td>
                  <Td>{u.cargo}</Td>
                  <Td>{u.status}</Td>
                  <Td>
                    {Object.entries(u.perfis || {})
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(", ")}
                  </Td>
                  <Td>{u.criadoEm}</Td>
                  <Td>
                    <button
                      onClick={() => remover(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageWrapper>
  );
}

/* COMPONENTES AUXILIARES */
function Input({ label, type = "text", ...props }) {
  return (
    <input
      type={type}
      placeholder={label}
      className="border p-2 rounded w-full"
      {...props}
      required
    />
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}
