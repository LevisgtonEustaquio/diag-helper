import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { 
  MdAutoAwesome, 
  MdCheck, 
  MdClose, 
  MdPictureAsPdf, 
  MdPerson, 
  MdArrowBack,
  MdPlayArrow 
} from "react-icons/md";
import { jsPDF } from "jspdf"; 
import api from "../services/api";

export default function AnaliseExame() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exame = state?.exame;
  
  const [analisando, setAnalisando] = useState(false); // Começa como false
  const [analiseIniciada, setAnaliseIniciada] = useState(false); // Novo estado
  const [resultadoIA, setResultadoIA] = useState("");
  const [aceito, setAceito] = useState(null); 
  const [observacoes, setObservacoes] = useState("");
  const usuarioLogado = localStorage.getItem("usuarioNome") || "Médico Responsável";

  // FUNÇÃO PARA INICIAR A ANÁLISE MANUALMENTE
  const iniciarAnaliseIA = () => {
    // VALIDAÇÃO: Verifica se existem arquivos
    if (!exame.arquivos || exame.arquivos.length === 0) {
      alert("Erro: Não há imagens anexadas para realizar a análise. Por favor, volte e anexe as fotos do exame.");
      return;
    }

    setAnalisando(true);
    setAnaliseIniciada(true);

    // Simulação do processamento da IA
    setTimeout(() => {
      setResultadoIA("A análise preliminar via IA sugere padrões de normalidade nos tecidos observados, com leve desvio nos índices hematológicos. Recomenda-se correlação clínica.");
      setAnalisando(false);
    }, 2500);
  };

 const finalizarLaudo = async () => {
  try {
    const doc = new jsPDF();
    const larguraPagina = doc.internal.pageSize.getWidth();
    const alturaPagina = doc.internal.pageSize.getHeight();
    const margem = 20;

    // --- 1. CABEÇALHO ---
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(`DiagHelper — ${exame.instituicao || ""}`, margem, 20);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Profissional: ${usuarioLogado}`, larguraPagina - 70, 15);
    doc.text(`Registro: ${exame.registroId || "1234"}`, larguraPagina - 70, 20);
    doc.text(`Data: ${new Date().toLocaleString()}`, larguraPagina - 70, 25);

    doc.setDrawColor(220);
    doc.line(margem, 35, larguraPagina - margem, 35);

    // --- 2. DADOS DA AMOSTRA E IA ---
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 100);
    doc.text("Dados da amostra e Resultado IA", margem, 45);

    doc.setFontSize(9);
    doc.setTextColor(40);
    doc.text(`Descrição: ${exame.tipo}`, margem, 52);

    doc.setFont("helvetica", "bold");
    doc.text("Resultado automatizado (IA):", margem, 60);
    doc.setFont("helvetica", "normal");
    doc.text(resultadoIA, margem, 65, { maxWidth: 170 });

    // --- 3. INCLUSÃO DE TODAS AS IMAGENS ---
    let yPos = 85;
    doc.setFont("helvetica", "bold");
    doc.text("Imagens Analisadas:", margem, yPos);
    yPos += 5;

    if (exame.arquivos && exame.arquivos.length > 0) {
      exame.arquivos.forEach((imgData, index) => {
        // Altura reservada para cada imagem (moldura + imagem)
        const alturaEspacoImg = 100;

        // Verifica se a imagem cabe na página atual, se não, adiciona nova página
        if (yPos + alturaEspacoImg > alturaPagina - 40) {
          doc.addPage();
          yPos = 20; // Reseta o Y no topo da nova página
        }

        // Título da imagem (ex: Foto 1)
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Anexo ${index + 1}`, margem, yPos);
        yPos += 2;

        // Desenha a moldura e a imagem
        doc.setDrawColor(240);
        doc.setFillColor(248, 249, 255);
        doc.roundedRect(margem, yPos, larguraPagina - (margem * 2), 90, 3, 3, "FD");
        
        // Adicionando a imagem
        doc.addImage(imgData, "JPEG", margem + 5, yPos + 5, larguraPagina - (margem * 2) - 10, 80);
        
        yPos += 95; // Espaçamento para a próxima imagem ou texto
      });
    }

    // --- 4. RESUMO INTERPRETATIVO (OBSERVAÇÕES DO MÉDICO) ---
    // Verifica se precisa de nova página para as observações
    if (yPos > alturaPagina - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 100);
    doc.text("Resumo interpretativo médico", margem, yPos + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.setFont("helvetica", "normal");
    doc.text(observacoes || "Análise clínica sem alterações significativas relatadas pelo médico.", margem, yPos + 20, { maxWidth: 170 });

    // --- 5. FINALIZAÇÃO ---
    const pdfBase64 = doc.output('datauristring');

    await api.put(`/exames/${exame.id}`, {
      ...exame,
      laudoGerado: true,
      pdfArquivo: pdfBase64,
      resultadoIA: resultadoIA,
      observacoesMedico: observacoes,
      analisado: true
    });

    doc.save(`Laudo_${exame.pacienteNome}.pdf`);
    alert("Laudo completo com todas as imagens gerado!");
    navigate("/Laudo");

  } catch (error) {
    console.error("Erro ao gerar laudo:", error);
    alert("Erro ao processar o PDF.");
  }
};

  if (!exame) return <PageWrapper>Exame não encontrado.</PageWrapper>;

  return (
    <PageWrapper title="Análise Inteligente de Exame">
      <div className="max-w-6xl mx-auto pb-10">
        
        <div className="mb-6">
          <button 
            onClick={() => navigate("/Laudo")} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <MdArrowBack size={20} /> Voltar para a lista
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lado Esquerdo: Visualização das Imagens */}
          <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[500px] shadow-xl overflow-hidden">
            <h3 className="text-white mb-4 self-start font-bold flex items-center gap-2">
              <MdPictureAsPdf /> Anexos do Paciente
            </h3>
            {exame.arquivos?.length > 0 ? (
              <div className="w-full h-full overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {exame.arquivos.map((img, idx) => (
                  <img key={idx} src={img} className="w-full rounded-lg border border-slate-700 shadow-md" alt="Exame" />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-slate-500 mb-2">Nenhuma imagem disponível.</p>
                <span className="text-xs text-red-400 font-bold uppercase tracking-widest">Análise Indisponível</span>
              </div>
            )}
          </div>

          {/* Lado Direito: Painel da IA */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <MdAutoAwesome size={24} className={analisando ? "animate-spin" : ""} />
                  <h2 className="font-bold text-lg">Análise da IA</h2>
                </div>
                
                {/* BOTÃO PARA INICIAR ANÁLISE */}
                {!analiseIniciada && (
                  <button 
                    onClick={iniciarAnaliseIA}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md"
                  >
                    <MdPlayArrow size={20} /> Iniciar Análise
                  </button>
                )}
              </div>
              
              {!analiseIniciada ? (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center">
                  <p className="text-slate-400 text-sm">Clique no botão acima para processar as imagens com Inteligência Artificial.</p>
                </div>
              ) : analisando ? (
                <div className="p-6 bg-slate-50 rounded-xl text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-500 italic">Identificando padrões e morfologia celular...</p>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-slate-700 leading-relaxed animate-in fade-in slide-in-from-top-2">
                  {resultadoIA}
                </div>
              )}

              {analiseIniciada && !analisando && (
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => setAceito(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${aceito === true ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'}`}
                  >
                    <MdCheck /> Aceitar
                  </button>
                  <button 
                    onClick={() => setAceito(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${aceito === false ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-red-50'}`}
                  >
                    <MdClose /> Recusar
                  </button>
                </div>
              )}
            </div>

            {/* Observações e Finalização */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="block font-bold text-slate-700 mb-2">Observações Adicionais</label>
              <textarea 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                placeholder="Digite aqui suas conclusões clínicas..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
              
              <div className="mt-6 p-4 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MdPerson /> <strong>Assinatura:</strong> {usuarioLogado}
                </div>
                
                <button 
                  onClick={finalizarLaudo}
                  disabled={aceito === null || analisando}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 shadow-lg transition-all"
                >
                  <MdPictureAsPdf size={20} /> Finalizar e Gerar Laudo PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}