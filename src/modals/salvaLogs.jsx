import api from "../services/api";

export function salvaLogs(acao, tipo = "GERAL", usuarioNome = "Desconhecido") {
  const log = {
    usuario: usuarioNome,
    acao: acao,
    tipo: tipo,
    data: new Date().toISOString(),
    ip: "127.0.0.1"
  };

  api
    .post("/LogsAuditoria", log)
    .then(() => console.log("Log salvo:", log))
    .catch((err) => console.error("Erro ao salvar log:", err));
}
