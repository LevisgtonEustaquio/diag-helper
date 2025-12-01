import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NovoExame from "../modals/NovoExame";

function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [pesquisa, setPesquisa] = useState("");

  const [formPacientes, setFormPacientes] = useState({
    nome: "",
    dataNascimento: "",
    telefone: "",
    cpf: "",
    idade: "",
    exames: [],
  });

  const [novoExame, setNovoExame] = useState({
    tipo: "",
    data: "",
    resultado: "",
  });

  // Estados do modal
  const [modalExameAberto, setModalExameAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const [exameNovoModal, setExameNovoModal] = useState({
    tipo: "",
    data: "",
    resultado: "",
  });

  // Carregar pacientes do backend
  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  // Atualiza dados do paciente
  const handleChange = (e) => {
    setFormPacientes({ ...formPacientes, [e.target.name]: e.target.value });
  };

  // Atualiza dados do exame temporário
  const handleExameChange = (e) => {
    setNovoExame({ ...novoExame, [e.target.name]: e.target.value });
  };

  // Adiciona exame ao array do paciente (na seção do formulário de cadastro)
  const adicionarExame = () => {
    if (!novoExame.tipo || !novoExame.data || !novoExame.resultado) return;
    setFormPacientes({
      ...formPacientes,
      exames: [...formPacientes.exames, novoExame],
    });
    setNovoExame({ tipo: "", data: "", resultado: "" });
  };

  // Iniciar edição de paciente
  function iniciarEdicao(paciente) {
    setEditId(paciente.id);
    setFormPacientes(paciente);
  }

  // Salvar edição
  const salvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/pacientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPacientes),
      });

      const atualizado = await res.json();
      setPacientes((prev) =>
        prev.map((p) => (p.id === editId ? atualizado : p))
      );
      setEditId(null);
      limparFormulario();
    } catch (error) {
      console.error("Erro ao editar paciente:", error);
    }
  };

  // Excluir paciente
  const excluirPaciente = async (id) => {
    try {
      await fetch(`http://localhost:3001/pacientes/${id}`, { method: "DELETE" });
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
    }
  };

  // Cadastrar paciente com exames
  const cadastrarPaciente = async (e) => {
    e.preventDefault();
    if (!formPacientes.nome || !formPacientes.dataNascimento || !formPacientes.telefone) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPacientes),
      });

      const pacienteSalvo = await res.json();
      setPacientes((prev) => [...prev, pacienteSalvo]);
      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
    }
  };

  function limparFormulario() {
    setFormPacientes({
      nome: "",
      dataNascimento: "",
      telefone: "",
      cpf: "",
      idade: "",
      exames: [],
    });
    setNovoExame({ tipo: "", data: "", resultado: "" });
  }

  // Abrir modal para adicionar novo exame
  function abrirModalExame(paciente) {
    setPacienteSelecionado(paciente);
    setExameNovoModal({ tipo: "", data: "", resultado: "" });
    setModalExameAberto(true);
  }

  // Salvar exame pelo modal
  async function salvarExameModal() {
    if (!exameNovoModal.tipo || !exameNovoModal.data || !exameNovoModal.resultado) {
      alert("Preencha todos os campos do exame.");
      return;
    }

    const examesAtualizados = [
      ...(pacienteSelecionado.exames || []),
      exameNovoModal,
    ];

    try {
      const res = await fetch(
        `http://localhost:3001/pacientes/${pacienteSelecionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...pacienteSelecionado,
            exames: examesAtualizados,
          }),
        }
      );

      const atualizado = await res.json();

      setPacientes((prev) =>
        prev.map((p) => (p.id === atualizado.id ? atualizado : p))
      );

      setModalExameAberto(false);
      setPacienteSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar exame:", error);
    }
  }

  // Filtrar pacientes pela pesquisa
  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.cpf.includes(pesquisa)
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />

      <main className={`flex-1 p-8 ${modalExameAberto ? "blur-sm" : ""}`}>
        <h1 className="text-2xl font-bold mb-6">Cadastro de Pacientes</h1>

        {/* Campo de pesquisa */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Pesquisar paciente por nome ou CPF"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-lg"
          />
        </div>

        {/* FORMULÁRIO COMPLETO (Paciente + Exames) */}
        <form
          onSubmit={editId ? salvarEdicao : cadastrarPaciente}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg border"
        >
          <div>
            <label className="font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              value={formPacientes.nome}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={formPacientes.dataNascimento}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formPacientes.telefone}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="(xx) xxxxx-xxxx"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formPacientes.cpf}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="xxx.xxx.xxx-xx"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Idade</label>
            <input
              type="number"
              name="idade"
              value={formPacientes.idade}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="Idade"
            />
          </div>

          {/* Campos do exame */}
          <div className="md:col-span-3 border-t pt-4 mt-4">
            <h2 className="font-bold text-lg mb-2">Adicionar Exame</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <input
                type="text"
                name="tipo"
                placeholder="Tipo de exame"
                value={novoExame.tipo}
                onChange={handleExameChange}
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="date"
                name="data"
                value={NovoExame.data}
                onChange={handleExameChange}
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="text"
                name="resultado"
                placeholder="Resultado"
                value={novoExame.resultado}
                onChange={handleExameChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={adicionarExame}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Adicionar Exame
            </button>

            {formPacientes.exames.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {formPacientes.exames.map((e, idx) => (
                  <li key={idx}>
                    {e.tipo} - {e.data} - {e.resultado}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition md:col-span-3"
          >
            {editId ? "Salvar edição" : "Cadastrar paciente"}
          </button>
        </form>


        {/* LISTA DE PACIENTES */}
        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800">
          Pacientes cadastrados
        </h2>

        <div className="space-y-2">
          {pacientesFiltrados.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded-lg border items-start"
            >
              <p><span className="font-bold">Nome:</span> {p.nome}</p>
              <p><span className="font-bold">Nascimento:</span> {p.dataNascimento}</p>
              <p><span className="font-bold">Telefone:</span> {p.telefone}</p>
              <p><span className="font-bold">CPF:</span> {p.cpf}</p>
              <p><span className="font-bold">Idade:</span> {p.idade}</p>

              <div className="flex flex-col gap-1">

                {/* BOTÕES */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => iniciarEdicao(p)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => excluirPaciente(p.id)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Excluir
                  </button>

                  <button
                    onClick={() => abrirModalExame(p)}
                    className="text-green-700 text-xl font-bold hover:scale-125 transition"
                    title="Adicionar exame"
                  >
                    +
                  </button>
                </div>

                {/* EXAMES */}
                <div className="mt-2">
                  <p className="font-bold">Exames:</p>
                  {p.exames && p.exames.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {p.exames.map((e, idx) => (
                        <li key={idx}>
                          {e.tipo} - {e.data} - {e.resultado}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">Nenhum exame cadastrado</p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>


      {/* MODAL */}
      {modalExameAberto && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Novo Exame para {pacienteSelecionado?.nome}
            </h2>

            <input
              type="text"
              placeholder="Tipo do exame"
              value={exameNovoModal.tipo}
              onChange={(e) =>
                setExameNovoModal({ ...exameNovoModal, tipo: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />

            <input
              type="date"
              value={exameNovoModal.data}
              onChange={(e) =>
                setExameNovoModal({ ...exameNovoModal, data: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />

            <input
              type="text"
              placeholder="Resultado"
              value={exameNovoModal.resultado}
              onChange={(e) =>
                setExameNovoModal({
                  ...exameNovoModal,
                  resultado: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setModalExameAberto(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={salvarExameModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CadastroPacientes