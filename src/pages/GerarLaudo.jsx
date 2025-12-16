import { useState } from "react";
import ModalConcluido from "../modals/ModalConcluido";
import ModalFalha from "../modals/ModalFalha";
import ModalProcessando from "../modals/ModalProcessando";
import logo from "../assets/logopreta.svg";
import PageWrapper from "../components/PageWrapper";

export default function GerarLaudo() {
  const [modalAberto, setModalAberto] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [resultadoAutomatico, setResultadoAutomatico] = useState("");

  function handleImagem(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImagens(files);
      setPreviews(files.map(file => URL.createObjectURL(file)));
      setResultadoAutomatico("Aguardando análise");
    }
  }

  function removerImagem(idx) {
    setImagens(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  function handleGerarLaudo() {
    if (imagens.length === 0) {
      setModalAberto("falha");
      return;
    }
    setModalAberto("processando");
    setTimeout(() => {
      setResultadoAutomatico("Análise concluída (Manualmente enviado)");
      setModalAberto("concluido");
    }, 2000);
  }

  function visualizarLaudo() {
    if (previews.length === 0) return alert("Envie uma imagem primeiro!");

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
      <head>
      <title>Laudo Médico</title>
      <script src="https://cdn.tailwindcss.com"></script>
      </head>

      <body class="font-sans p-5">
     
        <div class="flex items-center gap-4 mb-5">
          <img src="${logo}" class="w-40 h-auto" />
        </div>

        <hr class="border-gray-500 mb-5" />

        <h2 class="mb-5 text-xl font-semibold">Laudo Médico<h2>

        <button 
          onclick="gerarPDF()" 
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer mb-6"> 
          Baixar PDF 
        </button>

        <h3>Resultado da análise:</h3>
        <p><strong>${resultadoAutomatico}</strong></p>

        <h3 class="mt-6">Imagens analisadas:</h3>

        ${previews
        .map(
          src => `
            <img src="${src}" 
              class="w-full max-w-3xl h-auto block mx-auto my-6 rounded-lg shadow-md" 
            />`
        )
        .join("")}

        <h3 class="mt-6">Observações:</h3>
        <p>${observacoes || "Nenhuma observação adicionada."}</p>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script>
          async function gerarPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let y = 20;

            doc.setFontSize(18);
            doc.text("Laudo Médico", 105, y, { align: "center" });
            y += 15;

            doc.setFontSize(12);
            doc.text("Resultado da análise:", 10, y);
            y += 7;

            doc.setFont(undefined, "bold");
            doc.text("${resultadoAutomatico || "—"}", 10, y);
            doc.setFont(undefined, "normal");
            y += 15;

            ${previews
        .map(
          (src, i) => `
                let img${i} = new Image();
                img${i}.src = "${src}";
                await img${i}.decode();
                let w${i} = 160;
                let h${i} = (img${i}.height / img${i}.width) * w${i};

                if (y + h${i} > 280) {
                  doc.addPage();
                  y = 20;
                }

                doc.addImage(img${i}, "JPEG", 25, y, w${i}, h${i});
                y += h${i} + 10;
              `
        )
        .join("")}

            if (y > 240) {
              doc.addPage();
              y = 20;
            }

            doc.setFontSize(14);
            doc.text("Observações:", 10, y);
            y += 10;

            doc.setFontSize(12);
            const text = "${observacoes || "Nenhuma observação adicionada."}";
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 10, y);

            doc.save("laudo.pdf");
          }
        </script>

      </body>
      </html>
    `);

    win.document.close();
  }

  return (

    <PageWrapper title="Gerar laudo">
    
    

      <main className="flex-1 p-8">
        {/* <h1 className="text-3xl font-bold mb-8 text-gray-800">Gerar Laudo</h1> */}

        <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border">

          <label className="block mb-6">
            <span className="text-gray-700 font-semibold">Enviar exame (imagens)</span>

            <div className="mt-2">
              <label
                htmlFor="fileUpload"
                className="block w-full border rounded-lg p-3 bg-gray-50 cursor-pointer text-center font-medium hover:bg-gray-100"
              >
                Selecionar imagens
              </label>

              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagem}
                className="hidden"
              />
            </div>
          </label>

          {previews.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">Pré-visualização:</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group border rounded-lg overflow-hidden shadow-md">
                    <img src={src} className="w-full h-44 object-contain bg-white" />
                    <button
                      onClick={() => removerImagem(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                Resultado automático:{" "}
                <span className="text-blue-600">{resultadoAutomatico}</span>
              </p>
            </div>
          )}

          <label className="block mb-6">
            <span className="text-gray-700 font-semibold">Observações do laudo</span>
            <textarea
              className="w-full mt-2 p-3 border rounded-lg bg-gray-50 min-h-32"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva detalhes importantes do exame..."
            />
          </label>

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

          </div>
        </div>

        <ModalConcluido open={modalAberto === "concluido"} onClose={() => setModalAberto(null)} />
        <ModalFalha open={modalAberto === "falha"} onClose={() => setModalAberto(null)} />
        <ModalProcessando open={modalAberto === "processando"} onClose={() => setModalAberto(null)} />
      </main>
    
    </PageWrapper>
  );
}


