import React, { useState, useEffect } from "react";
import { MdSave } from "react-icons/md";
import { TIPOS_EXAMES } from "../components/ListaExames";

export default function FormularioExame({ 
  pacientes, 
  exameParaEditar, 
  onSalvar, 
  onCancelar, 
  setModalStatus 
}) {
  const [carregandoArquivos, setCarregandoArquivos] = useState(false);
  const [arquivosBase64, setArquivosBase64] = useState([]);
  
  const [form, setForm] = useState({
    pacienteId: "",
    pacienteNome: "",
    tipo: "",
    data: "",
    resultado: "",
    arquivos: [],
    observacoes: "",
  });

  useEffect(() => {
    if (exameParaEditar) {
      setForm(exameParaEditar);
      setArquivosBase64(exameParaEditar.arquivos || []);
    }
  }, [exameParaEditar]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    const arquivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type));

    if (arquivosInvalidos.length > 0) {
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Arquivo Não Suportado",
        mensagem: "Apenas imagens (JPEG, PNG) são permitidas.",
      });
      return;
    }

    setCarregandoArquivos(true);
    try {
      const processados = await Promise.all(
        files.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }))
      );
      setArquivosBase64(processados);
    } catch (err) {
      setModalStatus({ open: true, tipo: "erro", titulo: "Erro", mensagem: "Falha ao converter imagens." });
    } finally {
      setCarregandoArquivos(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      ...form,
      arquivos: arquivosBase64.length > 0 ? arquivosBase64 : form.arquivos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 p-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Paciente</label>
        <select
          required
          value={form.pacienteId}
          onChange={(e) => {
            const p = pacientes.find(x => String(x.id) === String(e.target.value));
            if (p) setForm({ ...form, pacienteId: p.id, pacienteNome: p.nome });
          }}
          className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        >
          <option value="">Selecione o paciente</option>
          {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Tipo de Análise</label>
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          required
          className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        >
          <option value="">Selecione o tipo</option>
          {TIPOS_EXAMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Data da Coleta</label>
        <input
          type="date"
          required
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Resultado Preliminar</label>
        <input
          placeholder="Ex: Normal, Alterado..."
          value={form.resultado}
          onChange={(e) => setForm({ ...form, resultado: e.target.value })}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Imagens da Amostra</label>
        <div className="relative">
          <input
            type="file" multiple accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2.5 rounded-xl text-xs bg-slate-50"
            disabled={carregandoArquivos}
          />
        </div>
      </div>

      <div className="col-span-full flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Observações Médicas</label>
        <textarea
          placeholder="Notas adicionais..."
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          className="border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 resize-none transition-all text-sm"
        />
      </div>

      <div className="flex gap-3 col-span-full pt-4 border-t border-slate-100 mt-2">
        <button
          type="submit"
          disabled={carregandoArquivos}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-md cursor-pointer"
        >
          <MdSave size={20} />
          {carregandoArquivos ? "Processando..." : "Salvar Registro"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 