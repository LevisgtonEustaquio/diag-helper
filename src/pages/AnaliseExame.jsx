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
  MdPlayArrow,
  MdImage,
  MdContentCopy,
} from "react-icons/md";
import { jsPDF } from "jspdf";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { registrarLog } from "../services/auditService"; // Importação do Log
import ModalErro from "../modals/ModalErro";
import ModalAviso from "../modals/ModalAviso";

import logoProjeto from "../assets/6.svg";

export default function AnaliseExame() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exame = state?.exame;
  const { usuario } = useAuth();

  const [analisando, setAnalisando] = useState(false);
  const [analiseIniciada, setAnaliseIniciada] = useState(false);
  const [resultadoIA, setResultadoIA] = useState("");
  const [aceito, setAceito] = useState(null);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para Modais
  const [modalStatus, setModalStatus] = useState({
    open: false,
    tipo: "",
    titulo: "",
    mensagem: "",
  });

  const nomeProfissional = usuario?.nome || "Médico Responsável";
  const registroProfissional = usuario?.registro || "1234-UF";

  // Log de Acesso à análise
  useEffect(() => {
    if (exame) {
      registrarLog(
        nomeProfissional,
        `Iniciou visualização da análise: ${exame.pacienteNome}`,
        "VISUALIZAÇÃO",
      );
    }
  }, [exame]);

  const carregarImagem = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject(err);
    });
  };

  const simularIA = () => {
    const resultados = [
      "A análise preliminar via IA sugere padrões de normalidade nos tecidos observados, com leve desvio nos índices hematológicos. Recomenda-se correlação clínica.",
      "Identificada presença de infiltrado inflamatório linfocitário moderado. Sugere-se investigação para processos crônicos ou infecciosos específicos.",
      "Morfologia celular preservada. Não foram detectadas atipias significativas nas lâminas analisadas pela rede neural.",
      "Detectada alteração na densidade celular em regiões focais. Recomenda-se nova coleta ou análise imuno-histoquímica para complementação.",
    ];
    return resultados[Math.floor(Math.random() * resultados.length)];
  };

  const iniciarAnaliseIA = async () => {
    if (!exame.arquivos || exame.arquivos.length === 0) {
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Sem Imagens",
        mensagem: "Não há imagens anexadas para processamento.",
      });
      return;
    }
    setAnalisando(true);
    setAnaliseIniciada(true);

    // LOG: Início do processamento de IA
    await registrarLog(
      nomeProfissional,
      `Solicitou processamento IA para: ${exame.pacienteNome}`,
      "PROCESSAMENTO",
    );

    setTimeout(() => {
      setResultadoIA(simularIA());
      setAnalisando(false);
    }, 2500);
  };

  const copiarResultado = async () => {
    navigator.clipboard.writeText(resultadoIA);
    // LOG: Cópia de resultado (Proteção de dados)
    await registrarLog(
      nomeProfissional,
      `Copiou resultado da IA do paciente: ${exame.pacienteNome}`,
      "COPIA",
    );
    setModalStatus({
      open: true,
      tipo: "aviso",
      titulo: "Copiado!",
      mensagem: "Resultado copiado para a área de transferência.",
    });
  };

  const finalizarLaudo = async () => {
    if (aceito === false && !motivoRecusa.trim()) {
      setModalStatus({
        open: true,
        tipo: "aviso",
        titulo: "Justificativa Necessária",
        mensagem: "Por favor, preencha o motivo da recusa.",
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const larguraPagina = doc.internal.pageSize.getWidth();
      const margem = 20;
      const larguraUtil = larguraPagina - margem * 2;
      let yPos = 15;

      try {
        const logoData = await carregarImagem(logoProjeto);
        doc.addImage(logoData, "PNG", margem, yPos, 28, 15);
      } catch (e) {
        console.warn("Logo não carregada.");
      }

      const xTextoHeader = margem + 30;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `${exame.instituicao || "Unidade Clínica"}`,
        xTextoHeader,
        yPos + 7,
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(
        "DOCUMENTO MÉDICO OFICIAL DE ANÁLISE DIGITAL",
        xTextoHeader,
        yPos + 12,
      );

      const colDireita = larguraPagina - 75;
      doc.text(`Profissional: ${nomeProfissional}`, colDireita, yPos + 4);
      doc.text(`Registro: ${registroProfissional}`, colDireita, yPos + 8);
      doc.text(
        `Data: ${new Date().toLocaleDateString()}`,
        colDireita,
        yPos + 12,
      );

      doc.setDrawColor(230);
      doc.line(margem, yPos + 18, larguraPagina - margem, yPos + 18);
      yPos += 28;

      // 1. IDENTIFICAÇÃO DO PACIENTE
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("1. IDENTIFICAÇÃO DO PACIENTE", margem, yPos);
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Nome: ${exame.pacienteNome || "Não informado"}`, margem, yPos);
      doc.text(
        `ID Interno: ${String(exame.id).substring(0, 8).toUpperCase() || "---"}`,
        larguraPagina / 2 + 10,
        yPos,
      );
      yPos += 12;

      // 2. INFORMAÇÕES DO EXAME
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("2. INFORMAÇÕES DO EXAME", margem, yPos);
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Tipo de Exame: ${exame.tipo || "Não especificado"}`,
        margem,
        yPos,
      );
      const dataFormatada = exame.data
        ? exame.data.split("-").reverse().join("/")
        : "---";
      doc.text(
        `Data de Cadastro: ${dataFormatada}`,
        larguraPagina / 2 + 10,
        yPos,
      );
      yPos += 12;

      // 3. PARECER IA
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("3. PARECER TÉCNICO COMPUTACIONAL (IA)", margem, yPos);
      yPos += 7;

      if (aceito) {
        doc.setFillColor(240, 253, 244);
        doc.setTextColor(5, 150, 105);
      } else {
        doc.setFillColor(254, 242, 242);
        doc.setTextColor(185, 28, 28);
      }

      doc.rect(margem, yPos, larguraUtil, 8, "F");
      const statusText = aceito
        ? "ACEITO PELO ESPECIALISTA"
        : "DIVERGÊNCIA IDENTIFICADA";
      doc.text(`STATUS DA ANÁLISE: ${statusText}`, margem + 3, yPos + 5.5);

      yPos += 14;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      const textoIA = doc.splitTextToSize(resultadoIA, larguraUtil);
      doc.text(textoIA, margem, yPos);
      yPos += textoIA.length * 5 + 8;

      if (aceito === false) {
        doc.setDrawColor(185, 28, 28);
        doc.setLineWidth(0.5);
        doc.line(margem, yPos, margem, yPos + 15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(185, 28, 28);
        doc.text("Justificativa da Divergência:", margem + 4, yPos + 4);
        yPos += 9;
        doc.setFont("helvetica", "italic");
        doc.setTextColor(40);
        const textoMotivo = doc.splitTextToSize(motivoRecusa, larguraUtil - 10);
        doc.text(textoMotivo, margem + 4, yPos);
        yPos += textoMotivo.length * 5 + 12;
      }

      // 4. CONCLUSÃO
      if (yPos > 210) {
        doc.addPage();
        yPos = 20;
      }
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.text("4. CONCLUSÃO E NOTAS DO ESPECIALISTA", margem, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      const splitObs = doc.splitTextToSize(
        observacoes || "Análise concluída sem observações adicionais.",
        larguraUtil,
      );
      doc.text(splitObs, margem, yPos);

      // ASSINATURA E ANEXOS...
      let yAssinatura = 270;
      if (yPos > 250) {
        doc.addPage();
        yAssinatura = 50;
      }
      doc.setDrawColor(150);
      const centro = larguraPagina / 2;
      doc.line(centro - 40, yAssinatura, centro + 40, yAssinatura);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(nomeProfissional.toUpperCase(), centro, yAssinatura + 5, {
        align: "center",
      });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Registro Profissional: ${registroProfissional}`,
        centro,
        yAssinatura + 9,
        { align: "center" },
      );

      if (exame.arquivos?.length > 0) {
        exame.arquivos.forEach((img, index) => {
          doc.addPage();
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`ANEXO ${index + 1} - DOCUMENTAÇÃO FOTOGRÁFICA`, margem, 20);
          doc.addImage(img, "JPEG", margem, 30, larguraUtil, 120);
        });
      }

      const pdfBase64 = doc.output("datauristring");
      await api.put(`/exames/${exame.id}`, {
        ...exame,
        laudoGerado: true,
        pdfArquivo: pdfBase64,
        statusIA: aceito ? "aceito" : "recusado",
        resultadoIA: resultadoIA,
        motivoRecusaIA: aceito ? "" : motivoRecusa,
        observacoesMedico: observacoes,
        analisado: true,
        dataFinalizacao: new Date().toISOString(),
      });

      // LOG: Finalização do Laudo (Crítico)
      await registrarLog(
        nomeProfissional,
        `Finalizou laudo para o paciente: ${exame.pacienteNome}`,
        "CONCLUSÃO",
        `Status IA: ${aceito ? "Aceito" : "Recusado"} | Exame: ${exame.tipo}`,
      );

      doc.save(`Laudo_${exame.pacienteNome || "Exame"}.pdf`);
      navigate("/Laudo");
    } catch (error) {
      console.error("Erro no PDF:", error);
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Erro ao Finalizar",
        mensagem: "Não foi possível gerar o PDF ou salvar os dados.",
      });
    }
  };

  const fecharModal = () => setModalStatus({ ...modalStatus, open: false });

  if (!exame) return <PageWrapper>Exame não encontrado.</PageWrapper>;

  return (
    <PageWrapper title="Análise Inteligente de Exame">
      <div className="max-w-6xl mx-auto pb-10">
        <div className="mb-6">
          <button
            onClick={() => navigate("/Laudo")}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-700 transition-colors font-semibold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer"
          >
            <MdArrowBack size={20} /> Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LADO ESQUERDO: IMAGENS */}
          <div className="bg-primary-100 rounded-2xl p-4 flex flex-col items-center justify-start min-h-[500px] shadow-xl overflow-hidden">
            <h3 className="text-slate-800 mb-4 self-start font-bold flex items-center gap-2">
              <MdImage /> Imagens da Amostra ({exame.arquivos?.length || 0})
            </h3>
            {exame.arquivos?.length > 0 ? (
              <div className="w-full h-[600px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {exame.arquivos.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm z-10">
                      Anexo {idx + 1}
                    </span>
                    <img
                      src={img}
                      className="w-full rounded-lg border border-slate-700 shadow-md transition-transform group-hover:scale-[1.01]"
                      alt={`Anexo ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-500 italic">
                  Nenhum anexo encontrado.
                </p>
              </div>
            )}
          </div>

          {/* LADO DIREITO: IA E CONCLUSÃO */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary-600">
                  <MdAutoAwesome
                    size={24}
                    className={analisando ? "animate-spin" : ""}
                  />
                  <h2 className="font-bold text-lg">Processamento IA</h2>
                </div>
                {!analiseIniciada && (
                  <button
                    onClick={iniciarAnaliseIA}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-700 cursor-pointer transition-all"
                  >
                    <MdPlayArrow size={20} /> Analisar
                  </button>
                )}
              </div>

              {!analiseIniciada ? (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center text-slate-400 text-sm">
                  Aguardando comando.
                </div>
              ) : analisando ? (
                <div className="p-6 bg-slate-50 rounded-xl text-center">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-500 italic text-sm">
                    Escaneando morfologia...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-slate-700 relative group text-sm leading-relaxed">
                    {resultadoIA}
                    <button
                      onClick={copiarResultado}
                      className="absolute top-2 right-2 p-1.5 bg-white border border-purple-200 rounded-md text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <MdContentCopy size={14} />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setAceito(true);
                        setMotivoRecusa("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer ${aceito === true ? "bg-primary-600 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-primary-100"}`}
                    >
                      <MdCheck /> Aceitar
                    </button>
                    <button
                      onClick={() => setAceito(false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer ${aceito === false ? "bg-red-600 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-red-100"}`}
                    >
                      <MdClose /> Recusar
                    </button>
                  </div>

                  {aceito === false && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-red-600 uppercase mb-1 block ml-1">
                        Justificativa Médica (Obrigatória)
                      </label>
                      <textarea
                        className="w-full p-3 bg-red-50 border border-red-200 rounded-xl outline-none focus:ring-1 focus:ring-red-400 text-sm"
                        placeholder="Descreva a divergência..."
                        value={motivoRecusa}
                        onChange={(e) => setMotivoRecusa(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="block font-bold text-slate-700 mb-2">
                Conclusão Clínica Final
              </label>
              <textarea
                className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none text-sm"
                placeholder="Suas notas para o laudo..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <MdPerson size={16} /> {nomeProfissional} |{" "}
                  {registroProfissional}
                </div>
                <button
                  onClick={finalizarLaudo}
                  disabled={
                    aceito === null ||
                    (aceito === false && !motivoRecusa) ||
                    analisando
                  }
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-black shadow-lg transition-all cursor-pointer"
                >
                  <MdPictureAsPdf size={20} /> Finalizar Laudo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalErro
        open={modalStatus.open && modalStatus.tipo === "erro"}
        onClose={fecharModal}
        titulo={modalStatus.titulo}
        mensagem={modalStatus.mensagem}
      />
      <ModalAviso
        open={modalStatus.open && modalStatus.tipo === "aviso"}
        onClose={fecharModal}
        titulo={modalStatus.titulo}
        mensagem={modalStatus.mensagem}
      />
    </PageWrapper>
  );
}
