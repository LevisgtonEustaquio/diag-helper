import { useState } from "react";

function NovoExame({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    data: "",
    tipo: "",
    observacao: "",
  });

  if (!isOpen) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvarExame() {
    if (!form.nome || !form.data || !form.tipo) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    onSave(form);
    setForm({ nome: "", data: "", tipo: "", observacao: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl animate-scaleIn">
        <h2 className="text-xl font-semibold mb-4">Novo Exame</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="font-medium">Nome do Exame*</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="font-medium">Data*</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="font-medium">Tipo do Exame*</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Selecione…</option>
              <option value="Raio-X">Raio-X</option>
              <option value="Tomografia">Tomografia</option>
              <option value="Ressonância">Ressonância</option>
              <option value="Ultrassom">Ultrassom</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Observações</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="border p-2 w-full rounded h-20"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={salvarExame}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default NovoExame;
