import { useState } from "react";
import Navbar from "../components/Navbar";
import ModalConcluido from "../modals/ModalConcluido";
import ModalFalha from "../modals/ModalFalha";
import ModalProcessando from "../modals/ModalProcessando";

export default function GerarLaudo() {
  const [modalAberto, setModalAberto] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [resultadoAutomatico, setResultadoAutomatico] = useState("");

  // Upload manual
  function handleImagem(e) {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
      setResultadoAutomatico("Aguardando análise");
    }
  }

  // Gerar Laudo
  function handleGerarLaudo() {
    if (!imagem) {
      setModalAberto("falha");
      return;
    }

    setModalAberto("processando");

    setTimeout(() => {
      setResultadoAutomatico("Análise concluída (Manualmente enviado)");
      setModalAberto("concluido");
    }, 2000);
  }

  // Visualizar Laudo
  function visualizarLaudo() {
    if (!preview) return alert("Envie uma imagem primeiro!");

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head><title>Laudo Médico</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Laudo Médico</h1>
          <hr />

          <h3>Resultado da análise:</h3>
          <p><strong>${resultadoAutomatico}</strong></p>

          <h3>Imagem analisada:</h3>
          <img src="${preview}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />

          <h3>Observações do médico:</h3>
          <p>${observacoes || "Nenhuma observação adicionada."}</p>
        </body>
      </html>
    `);

    win.document.close();
  }

  // Imprimir Laudo
  function imprimirLaudo() {
    visualizarLaudo();
    setTimeout(() => window.print(), 600);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Gerar Laudo</h1>

        <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border">

          {/* Upload */}
          <label className="block mb-6">
            <span className="text-gray-700 font-semibold">Enviar exame (imagem)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagem}
              className="mt-2 block w-full border rounded-lg p-2 bg-gray-50 cursor-pointer"
            />
          </label>

          {/* Pré-visualização */}
          {preview && (
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">Pré-visualização:</p>
              <img
                src={preview}
                className="w-full max-h-96 object-contain rounded-lg shadow-md mt-2"
              />

              <p className="mt-3 font-semibold text-gray-700">
                Resultado automático:{" "}
                <span className="text-blue-600">{resultadoAutomatico}</span>
              </p>
            </div>
          )}

          {/* Observações */}
          <label className="block mb-6">
            <span className="text-gray-700 font-semibold">Observações do laudo</span>
            <textarea
              className="w-full mt-2 p-3 border rounded-lg bg-gray-50 min-h-32"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva detalhes importantes do exame..."
            />
          </label>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              onClick={handleGerarLaudo}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Gerar Laudo
            </button>

            <button
              onClick={visualizarLaudo}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg"
            >
              Visualizar
            </button>

            <button
              onClick={imprimirLaudo}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Imprimir
            </button>
          </div>
        </div>

        {/* Modais */}
        <ModalConcluido open={modalAberto === "concluido"} onClose={() => setModalAberto(null)} />
        <ModalFalha open={modalAberto === "falha"} onClose={() => setModalAberto(null)} />
        <ModalProcessando open={modalAberto === "processando"} onClose={() => setModalAberto(null)} />
      </main>
    </div>
  );
}
