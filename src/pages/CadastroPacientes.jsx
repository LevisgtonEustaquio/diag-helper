import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";

export default function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    dataNascimento: "",
    telefone: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limparFormulario = () => {
    setForm({
      cpf: "",
      nome: "",
      dataNascimento: "",
      telefone: "",
    });
    setEditId(null);
    setMostrarFormulario(false);
  };

  const salvarPaciente = async (e) => {
    e.preventDefault();

    if (editId) {
      const res = await fetch(`http://localhost:3001/pacientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const atualizado = await res.json();
      setPacientes((prev) =>
        prev.map((p) => (p.id === editId ? atualizado : p))
      );
    } else {
      const res = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const novo = await res.json();
      setPacientes((prev) => [...prev, novo]);
    }

    limparFormulario();
  };

  const editarPaciente = (paciente) => {
    setForm(paciente);
    setEditId(paciente.id);
    setMostrarFormulario(true);
  };

  const removerPaciente = async (id) => {
    await fetch(`http://localhost:3001/pacientes/${id}`, {
      method: "DELETE",
    });
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  };

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.cpf.includes(pesquisa)
  );

  return (
    <PageWrapper title="Pacientes">
      {/* TOPO: Barra de pesquisa + Botão */}
      <div className="flex flex-col gap-2 mb-4 items-start">
        {/* Barra de pesquisa limitada */}
        <div className="w-full max-w-md">
          <BarraPesquisa
            value={pesquisa}
            onChange={setPesquisa}
            placeholder="🔍 Pesquisar por CPF ou Nome"
          />
        </div>

        {/* Botão abaixo da barra */}
        {!mostrarFormulario && (
          <div className="w-full max-w-xs">
            <BotaoCadastrar
              onClick={() => setMostrarFormulario(true)}
              label="Cadastrar"
            />
          </div>
        )}
      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <form
          onSubmit={salvarPaciente}
          className="bg-white p-6 rounded shadow mb-6 grid gap-3 max-w-xl"
        >
          <h2 className="text-lg font-bold">
            {editId ? "Editar Paciente" : "Novo Paciente"}
          </h2>

          <input
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="flex gap-3 mt-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {editId ? "Salvar" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={limparFormulario}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* LISTA */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">CPF</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.cpf}</td>
                <td className="p-2">{p.nome}</td>
                <td className="p-2">{p.telefone}</td>
                <td className="p-2 flex gap-3">
                  <button
                    onClick={() => editarPaciente(p)}
                    className="text-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removerPaciente(p.id)}
                    className="text-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
