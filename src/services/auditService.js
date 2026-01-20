
import api from "./api";

export const registrarLog = async (usuario, acao, tipo, detalhes = null) => {
  // Validação de parâmetros
  if (!usuario || !acao || !tipo) {
    console.warn("Parâmetros inválidos para registrarLog");
    return false;
  }

  const novoLog = {
    usuario,
    acao,
    tipo,
    detalhes,
    data: new Date().toISOString(),
    ip: "127.0.0.1"
  };

  try {
    await api.post("/LogsAuditoria", novoLog);
    return true;
  } catch (error) {
    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'development') {
      console.error("Erro ao registrar log de auditoria:", error);
    }
    return false;
  }
};