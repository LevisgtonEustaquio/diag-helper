import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";
import { MdSave, MdEdit, MdDelete, MdScience } from "react-icons/md";
import api from "../services/api";
import { registrarLog } from "../services/auditService";
import { TIPOS_EXAMES } from "../components/ListaExames";

export default function CadastroExames() {
  const [exames, setExames] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    pacienteId: "",
    pacienteNome: "",
    tipo: "",
    data: "",
    resultado: "",
    arquivo: "",
    observacoes: "",
  });

  /* ===============================
      BUSCAR EXAMES E PACIENTES
  =============================== */
  useEffect(() => {
  api.get("/exames").then((data) => setExames(data || []));
  api.get("/pacientes").then((data) => setPacientes(data || []));
}, []);

  /* ===============================
      FILTRO
  =============================== */
  const examesFiltrados = exames.filter(
    (e) =>
      e.pacienteNome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      e.tipo?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  /* ===============================
      HANDLERS
  =============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limparFormulario = () => {
    setForm({
      pacienteId: "",
      pacienteNome: "",
      tipo: "",
      data: "",
      resultado: "",
      arquivo: "",
      observacoes: "",
    });
    setEditId(null);
    setMostrarFormulario(false);
  };

  const salvarExame = async (e) => {
    e.preventDefault();

    if (editId) {
      await api.put(`/exames/${editId}`, form);
      setExames((prev) =>
        prev.map((e) => (e.id === editId ? { ...form, id: editId } : e))
      );
    } else {
      const res = await api.post("/exames", form);
      setExames((prev) => [...prev, res.data]);
    }

    const usuario = localStorage.getItem("usuarioNome") || "Usuário";
    await registrarLog(
      usuario,
      `Cadastrou/alterou exame (${form.tipo}) para ${form.pacienteNome}`,
      "EXAME"
    );

    limparFormulario();
  };

  const editarExame = (exame) => {
    setForm(exame);
    setEditId(exame.id);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removerExame = async (id) => {
    if (window.confirm("Deseja excluir este exame?")) {
      await api.delete(`/exames/${id}`);
      setExames((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <PageWrapper title="Exames">
      <div className="max-w-7xl mx-auto space-y-6 pb-10 ">
        {/* Barra superior */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <BarraPesquisa
  pesquisa={pesquisa}
  setPesquisa={setPesquisa}
  placeholder="Pesquisar exame ou paciente..."
  className="self-start"
/>
          {!mostrarFormulario && (
            <BotaoCadastrar
              label="Cadastrar Exame"
              onClick={() => setMostrarFormulario(true)}
            />
          )}
        </div>

        {/* FORMULÁRIO */}
        {mostrarFormulario && (
          <section className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <MdScience size={24} />
              <h2 className="font-bold">
                {editId ? "Editar Exame" : "Novo Exame"}
              </h2>
            </div>

            <form
              onSubmit={salvarExame}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* PACIENTE */}
              <select
                required
                value={form.pacienteId}
                onChange={(e) => {
                  const p = pacientes.find(
                    (x) => x.id === e.target.value
                  );
                  if (!p) return;

                  setForm({
                    ...form,
                    pacienteId: p.id,
                    pacienteNome: p.nome,
                  });
                }}
                className="border p-3 rounded-xl bg-slate-50"
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              {/* TIPO DO EXAME (ListaExames) */}
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className="border border-slate-200 p-3 rounded-xl bg-slate-50"
              >
                <option value="">Selecione o tipo de exame</option>
                {TIPOS_EXAMES.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>

              {/* DATA */}
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              {/* RESULTADO */}
              <input
                placeholder="Resultado"
                name="resultado"
                value={form.resultado}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              />

              {/* ARQUIVO */}
              <input
                type="file"
                accept=".pdf,image/*"
                className="border p-3 rounded-xl bg-slate-50"
                onChange={(e) =>
                  setForm({
                    ...form,
                    arquivo: e.target.files[0]?.name || "",
                  })
                }
              />

              {/* OBSERVAÇÕES */}
              <textarea
                name="observacoes"
                placeholder="Observações"
                value={form.observacoes}
                onChange={handleChange}
                className="border p-3 rounded-xl col-span-full"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 w-fit justify-start"
              >
                <MdSave size={18} /> Salvar Exame
              </button>
            </form>
          </section>
        )}

        {/* TABELA */}
        <section className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Paciente</th>
                <th className="p-3 text-left">Exame</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {examesFiltrados.map((e) => (
                <tr key={e.id}>
                  <td className="p-3">{e.pacienteNome}</td>
                  <td className="p-3">{e.tipo}</td>
                  <td className="p-3">
  {e.data && new Date(e.data).toLocaleDateString("pt-BR").replace(/\//g, "-")}
</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => editarExame(e)}
                      className="text-blue-600"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => removerExame(e.id)}
                      className="text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </PageWrapper>
  );
}
                

