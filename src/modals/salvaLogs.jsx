import api from "../services/api";

export async function salvaLogs(acao, tipo = "GERAL", usuarioNome = "Desconhecido") {
  const log = {
    usuario: usuarioNome,
    acao: acao,
    tipo: tipo,
    data: new Date().toISOString(),
    ip: "127.0.0.1"
  };

  try {
    await api.post("/LogsAuditoria", log);
    return true;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Erro ao salvar log:", err);
    }
    return false;
  }
}
