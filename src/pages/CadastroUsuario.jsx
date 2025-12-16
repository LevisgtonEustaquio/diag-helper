import { useState, useEffect } from "react";
import { MdSaveAlt } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("medico");
  const [erroCadastro, setErroCadastro] = useState("");

  // Buscar usuários ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const gerarDataHora = () => {
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${data} ${hora}`;
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
      criadoEm: gerarDataHora(),
    };

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioSalvo = await res.json();
      setUsuarios((prev) => [...prev, usuarioSalvo]);

      // Resetar form
      setForm({ nome: "", cpf: "", cargo: "", status: "Ativo" });
      setSenha("");
      setConfirmaSenha("");
      setTipoUsuario("medico");
      setErroCadastro("");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setErroCadastro("Erro ao cadastrar usuário.");
    }
  };

  const remover = async (id) => {
    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
    }
  };

  const total = usuarios.length;
  const ativos = usuarios.filter((u) => u.status === "Ativo").length;
  const novosHoje = usuarios.filter((u) =>
    u.criadoEm?.startsWith(new Date().toLocaleDateString("pt-BR"))
  ).length;

  return (
    <PageWrapper title="Dashboard">
      {/* FORM CADASTRO */}
      <section className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>

        <form
          onSubmit={cadastrar}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <Input
            label="CPF"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />

          {/* Cargo */}
          <Input
            label="Cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          />

          {/* Status */}
          <select
            className="border p-2 rounded w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>

          {/* Senha */}
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

          {/* Tipo de usuário */}
          <select
            className="border p-2 rounded w-full"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="medico">Médico Laudista</option>
            <option value="medicoAssistente">Médico Assistente</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="administrador">Administrador</option>
          </select>

          {erroCadastro && (
            <p className="text-red-500 text-sm mt-1 col-span-2">
              {erroCadastro}
            </p>
          )}

          {/* Botão salvar */}
          <button
            type="submit"
            className="bg-gray-500 text-black rounded flex items-center justify-center px-3 py-2 mt-2 w-32 hover:bg-gray-600"
          >
            <MdSaveAlt size={16} color="black" className="mr-2" />
            Salvar
          </button>
        </form>
      </section>

      {/* TABELA */}
      <section className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Usuários Cadastrados</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Cargo</Th>
                <Th>Status</Th>
                <Th>Tipo</Th>
                <Th>Criado em</Th>
                <Th>Ações</Th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b">
                  <Td>{u.nome}</Td>
                  <Td>{u.cpf}</Td>
                  <Td>{u.cargo}</Td>
                  <Td>{u.status}</Td>
                  <Td>{u.tipoUsuario}</Td>
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
function Card({ title, value, color }) {
  const bgColor =
    color === "blue"
      ? "bg-blue-600"
      : color === "green"
      ? "bg-green-600"
      : "bg-yellow-500";

  return (
    <div className={`${bgColor} p-4 shadow rounded text-center`}>
      <p className="font-semibold mb-2 text-white">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

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
