import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const gerarLaudoPDF = (exame) => {
  // 1. Verificação de segurança
  if (!exame) {
    alert("Erro: Dados do exame não encontrados para gerar o PDF.");
    return;
  }

  const doc = new jsPDF();
  const nome = exame.pacienteNome || "Paciente não identificado";
  
  // Título e Estilização
  doc.setFontSize(18);
  doc.setTextColor(41, 128, 185);
  doc.text("LAUDO MÉDICO FINAL - DIAG HELPER", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
  doc.line(14, 30, 196, 30);

  // Tabela de Dados do Paciente e Exame
  autoTable(doc, {
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    head: [['Informação', 'Detalhes']],
    body: [
      ['Paciente', nome.toUpperCase()],
      ['Tipo de Exame', exame.tipo || "Não informado"],
      ['Data do Exame', exame.data || "---"],
      ['Status', "ANALISADO"],
    ],
  });

  // Seção de Análise Técnica
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("PARECER TÉCNICO E ANÁLISE", 14, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    theme: 'striped',
    body: [
      ['Resultado da IA', exame.resultadoIA || "Não analisado pela IA"],
      ['Decisão Profissional', exame.decisaoProfissional === 'aceito' ? "ACEITO" : "DIVERGENTE"],
      ['Observações', exame.observacoesMedico || "Sem observações adicionais."]
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' }
    }
  });

  // Assinatura
  const footerY = doc.lastAutoTable.finalY + 20;
  doc.setFont("courier", "italic");
  doc.text("__________________________________________", 14, footerY);
  // Usa o campo assinadoPor se existir, senão usa o localStorage
  const assinante = exame.assinadoPor || localStorage.getItem("usuarioNome") || "Profissional Responsável";
  doc.text(assinante, 14, footerY + 7);

  // 2. Download do arquivo com verificação de ID
  const nomeArquivo = nome.split(' ')[0].replace(/[^a-z0-9]/gi, '_');
  // Se o id não existir, usamos um timestamp para não quebrar o código
  const idSufixo = exame.id ? String(exame.id).substring(0, 5) : Date.now();
  
  doc.save(`Laudo_${nomeArquivo}_${idSufixo}.pdf`);
};