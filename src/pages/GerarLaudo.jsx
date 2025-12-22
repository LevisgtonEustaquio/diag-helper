import { useState } from "react";
import ModalConcluido from "../modals/ModalConcluido";
import ModalFalha from "../modals/ModalFalha";
import ModalProcessando from "../modals/ModalProcessando";
import PageWrapper from "../components/PageWrapper";
import ListaLaudos from "../components/ListaLaudos";

export default function GerarLaudo() {
  const [modalAberto, setModalAberto] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [resultadoAutomatico, setResultadoAutomatico] = useState("");

  const [nomeMedico, setNomeMedico] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [dataLaudo, setDataLaudo] = useState("");

  const [laudos, setLaudos] = useState([]);

  function handleImagem(e) {
    const files = Array.from(e.target.files);
    setImagens(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
    setResultadoAutomatico("Aguardando análise");
  }

  function removerImagem(idx) {
    setImagens(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  function handleGerarLaudo() {
    if (!nomeMedico || !nomePaciente || !dataLaudo || imagens.length === 0) {
      setModalAberto("falha");
      return;
    }

    setModalAberto("processando");

    setTimeout(() => {
      const resultadoFinal = "Análise concluída";

      const novoLaudo = {
        id: Date.now(),
        medico: nomeMedico,
        paciente: nomePaciente,
        data: dataLaudo,
        tipo: "Laudo por imagem",
        resultado: resultadoFinal,
        observacoes,
        imagens: previews,
      };

      setLaudos(prev => [novoLaudo, ...prev]);
      setResultadoAutomatico(resultadoFinal);
      setModalAberto("concluido");

      // limpa campos
      setNomeMedico("");
      setNomePaciente("");
      setDataLaudo("");
      setObservacoes("");
      setImagens([]);
      setPreviews([]);
    }, 1500);
  }

  return (
    <PageWrapper title="Gerar Laudo">
      <main className="p-6">

        {/* FORMULÁRIO */}
        <div className="bg-white p-8 rounded-xl shadow max-w-4xl mx-auto">

          {/* DADOS DO LAUDO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Nome do médico"
              value={nomeMedico}
              onChange={e => setNomeMedico(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Nome do paciente"
              value={nomePaciente}
              onChange={e => setNomePaciente(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="date"
              value={dataLaudo}
              onChange={e => setDataLaudo(e.target.value)}
              className="border rounded-lg p-3"
            />
          </div>

          {/* UPLOAD */}
          <label className="block mb-6">
            <span className="font-semibold">Enviar exames</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagem}
              className="mt-2 block w-full"
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {previews.map((src, i) => (
                <div key={i} className="relative border rounded-lg p-2">
                  <img src={src} className="h-40 w-full object-contain" />
                  <button
                    onClick={() => removerImagem(i)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Observações do laudo"
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
          />

          <button
            onClick={handleGerarLaudo}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Gerar Laudo
          </button>
        </div>

        {/* LISTA DE LAUDOS */}
        {laudos.length > 0 && (
          <div className="mt-12 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Laudos Gerados</h2>
            <ListaLaudos laudos={laudos} />
          </div>
        )}

        <ModalConcluido open={modalAberto === "concluido"} onClose={() => setModalAberto(null)} />
        <ModalFalha open={modalAberto === "falha"} onClose={() => setModalAberto(null)} />
        <ModalProcessando open={modalAberto === "processando"} />
      </main>
    </PageWrapper>
  );
}
