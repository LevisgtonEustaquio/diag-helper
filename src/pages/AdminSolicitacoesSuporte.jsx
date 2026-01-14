import { useEffect, useState } from "react";

export default function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const suporte = JSON.parse(localStorage.getItem("solicitacoesSuporte")) || [];
    const senhaData = JSON.parse(localStorage.getItem("solicitacoesSenha")) || [];
    setSolicitacoes([...suporte, ...senhaData]);
  }, []);

  function abrirModal(solicitacao) {
    setSolicitacaoSelecionada(solicitacao);
    setSenha("");
    setConfirmarSenha("");
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setSolicitacaoSelecionada(null);
    setErro("");
    setSucesso("");
  }

  function salvarNovaSenha() {
    setErro("");
    setSucesso("");

    if (!senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // Atualiza usuário no localStorage (simulação)
    const usuarios = JSON.parse(localStorage.getItem("appUsuarios")) || [];
    const usuariosAtualizados = usuarios.map((u) =>
      u.email === solicitacaoSelecionada.email ? { ...u, senha } : u
    );
    localStorage.setItem("appUsuarios", JSON.stringify(usuariosAtualizados));

    // Atualiza status da solicitação
    const chave = solicitacaoSelecionada.tipo === "senha"
      ? "solicitacoesSenha"
      : "solicitacoesSuporte";

    const solicitacoesAtualizadas = JSON.parse(localStorage.getItem(chave)).map((s) =>
      s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
    );
    localStorage.setItem(chave, JSON.stringify(solicitacoesAtualizadas));

    // Atualiza tabela local
    setSolicitacoes(prev =>
      prev.map(s =>
        s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
      )
    );

    setSucesso("Senha redefinida com sucesso!");
    setTimeout(() => fecharModal(), 1500);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Solicitações</h1>

      {solicitacoes.length === 0 ? (
        <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Mensagem / Perfil</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.nome}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.tipo}</td>
                  <td className="p-3">{s.tipo === "senha" ? s.perfil : s.mensagem || "-"}</td>
                  <td className="p-3">
                    {s.status === "pendente" ? (
                      <span className="text-yellow-600">Pendente</span>
                    ) : (
                      <span className="text-green-600">Finalizado</span>
                    )}
                  </td>
                  <td className="p-3">{s.data}</td>
                  <td className="p-3 text-center">
                    {s.tipo === "senha" && s.status === "pendente" ? (
                      <button
                        onClick={() => abrirModal(s)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Redefinir senha
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Redefinir senha</h2>

            <label className="text-sm font-medium">Nova senha</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1 mb-3"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoFocus
            />

            <label className="text-sm font-medium">Confirmar nova senha</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1 mb-3"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}
            {sucesso && <p className="text-green-600 text-sm mb-3">{sucesso}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={salvarNovaSenha}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
