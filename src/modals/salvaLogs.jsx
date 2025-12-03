export function salvarLog(acao, tipo = "GERAL") {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const log = {
    usuario: usuario?.nome || "Desconhecido",
    acao: acao,
    tipo: tipo,
    data: new Date().toISOString(),
    ip: "127.0.0.1" // você pode trocar depois
  };

  fetch("http://localhost:3000/LogsAuditoria", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  })
    .then(() => console.log("Log salvo:", log))
    .catch((err) => console.error("Erro ao salvar log:", err));
}
