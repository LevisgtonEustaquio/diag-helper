// import { useEffect, useState } from "react";

// export default function AdminSolicitacoes() {
//   const [solicitacoes, setSolicitacoes] = useState([]);
//   const [modalAberto, setModalAberto] = useState(false);
//   const [senha, setSenha] = useState("");
//   const [confirmarSenha, setConfirmarSenha] = useState("");
//   const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
//   const [erro, setErro] = useState("");
//   const [sucesso, setSucesso] = useState("");

//   useEffect(() => {
//     const suporte = JSON.parse(localStorage.getItem("solicitacoesSuporte")) || [];
//     const senhaData = JSON.parse(localStorage.getItem("solicitacoesSenha")) || [];
//     setSolicitacoes([...suporte, ...senhaData]);
//   }, []);

//   function abrirModal(solicitacao) {
//     setSolicitacaoSelecionada(solicitacao);
//     setSenha("");
//     setConfirmarSenha("");
//     setErro("");
//     setSucesso("");
//     setModalAberto(true);
//   }

//   function fecharModal() {
//     setModalAberto(false);
//     setSolicitacaoSelecionada(null);
//     setErro("");
//     setSucesso("");
//   }

//   function salvarNovaSenha() {
//     setErro("");
//     setSucesso("");

//     if (!senha || !confirmarSenha) {
//       setErro("Preencha todos os campos.");
//       return;
//     }
//     if (senha !== confirmarSenha) {
//       setErro("As senhas não coincidem.");
//       return;
//     }

//     // Atualiza usuário no localStorage (simulação)
//     const usuarios = JSON.parse(localStorage.getItem("appUsuarios")) || [];
//     const usuariosAtualizados = usuarios.map((u) =>
//       u.email === solicitacaoSelecionada.email ? { ...u, senha } : u
//     );
//     localStorage.setItem("appUsuarios", JSON.stringify(usuariosAtualizados));

//     // Atualiza status da solicitação
//     const chave = solicitacaoSelecionada.tipo === "senha"
//       ? "solicitacoesSenha"
//       : "solicitacoesSuporte";

//     const solicitacoesAtualizadas = JSON.parse(localStorage.getItem(chave)).map((s) =>
//       s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
//     );
//     localStorage.setItem(chave, JSON.stringify(solicitacoesAtualizadas));

//     // Atualiza tabela local
//     setSolicitacoes(prev =>
//       prev.map(s =>
//         s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
//       )
//     );

//     setSucesso("Senha redefinida com sucesso!");
//     setTimeout(() => fecharModal(), 1500);
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Solicitações</h1>

//       {solicitacoes.length === 0 ? (
//         <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-100">
//               <tr>
//                 <th className="p-3 text-left">Nome</th>
//                 <th className="p-3 text-left">E-mail</th>
//                 <th className="p-3 text-left">Tipo</th>
//                 <th className="p-3 text-left">Mensagem / Perfil</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Data</th>
//                 <th className="p-3 text-center">Ações</th>
//               </tr>
//             </thead>
//             <tbody>
//               {solicitacoes.map((s) => (
//                 <tr key={s.id} className="border-t">
//                   <td className="p-3">{s.nome}</td>
//                   <td className="p-3">{s.email}</td>
//                   <td className="p-3">{s.tipo}</td>
//                   <td className="p-3">{s.tipo === "senha" ? s.perfil : s.mensagem || "-"}</td>
//                   <td className="p-3">
//                     {s.status === "pendente" ? (
//                       <span className="text-yellow-600">Pendente</span>
//                     ) : (
//                       <span className="text-green-600">Finalizado</span>
//                     )}
//                   </td>
//                   <td className="p-3">{s.data}</td>
//                   <td className="p-3 text-center">
//                     {s.tipo === "senha" && s.status === "pendente" ? (
//                       <button
//                         onClick={() => abrirModal(s)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                       >
//                         Redefinir senha
//                       </button>
//                     ) : (
//                       <span className="text-gray-400">-</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {modalAberto && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Redefinir senha</h2>

//             <label className="text-sm font-medium">Nova senha</label>
//             <input
//               type="password"
//               className="w-full border rounded-lg p-2 mt-1 mb-3"
//               value={senha}
//               onChange={(e) => setSenha(e.target.value)}
//               autoFocus
//             />

//             <label className="text-sm font-medium">Confirmar nova senha</label>
//             <input
//               type="password"
//               className="w-full border rounded-lg p-2 mt-1 mb-3"
//               value={confirmarSenha}
//               onChange={(e) => setConfirmarSenha(e.target.value)}
//             />

//             {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}
//             {sucesso && <p className="text-green-600 text-sm mb-3">{sucesso}</p>}

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={fecharModal}
//                 className="px-4 py-2 rounded-lg border hover:bg-gray-100"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={salvarNovaSenha}
//                 className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Salvar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

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

    // Atualiza usuário no localStorage
    const usuarios = JSON.parse(localStorage.getItem("appUsuarios")) || [];
    const usuariosAtualizados = usuarios.map((u) =>
      u.email === solicitacaoSelecionada.email ? { ...u, senha } : u
    );
    localStorage.setItem("appUsuarios", JSON.stringify(usuariosAtualizados));

    // Identifica em qual chave do localStorage a solicitação está salva
    const chave = solicitacaoSelecionada.tipo === "senha"
      ? "solicitacoesSenha"
      : "solicitacoesSuporte";

    const solicitacoesSalvas = JSON.parse(localStorage.getItem(chave)) || [];
    const solicitacoesAtualizadas = solicitacoesSalvas.map((s) =>
      s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
    );
    localStorage.setItem(chave, JSON.stringify(solicitacoesAtualizadas));

    // Atualiza o estado da tabela localmente
    setSolicitacoes(prev =>
      prev.map(s =>
        s.id === solicitacaoSelecionada.id ? { ...s, status: "finalizado" } : s
      )
    );

    setSucesso("Senha redefinida com sucesso!");
    setTimeout(() => fecharModal(), 1500);
  }

  return (
    <PageWrapper>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Gerenciamento de Solicitações</h1>

        {solicitacoes.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Nenhuma solicitação encontrada.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">Nome</th>
                  <th className="p-4 font-semibold text-slate-700">E-mail</th>
                  <th className="p-4 font-semibold text-slate-700">Tipo</th>
                  <th className="p-4 font-semibold text-slate-700">Mensagem / Perfil</th>
                  <th className="p-4 font-semibold text-slate-700">Status</th>
                  <th className="p-4 font-semibold text-slate-700">Data</th>
                  <th className="p-4 text-center font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitacoes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 font-medium">{s.nome}</td>
                    <td className="p-4 text-slate-600">{s.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        s.tipo === 'senha' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">
                      {s.tipo === "senha" ? s.perfil : s.mensagem || "-"}
                    </td>
                    <td className="p-4">
                      {s.status === "pendente" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Finalizado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{s.data}</td>
                    <td className="p-4 text-center">
                      {/* OPÇÃO 1: Botão liberado para qualquer tipo que esteja Pendente */}
                      {s.status === "pendente" ? (
                        <button
                          onClick={() => abrirModal(s)}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-xs font-bold"
                        >
                          Redefinir senha
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Sem ações pendentes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Redefinição */}
        {modalAberto && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-1 text-slate-800">Redefinir Senha</h2>
              <p className="text-slate-500 text-sm mb-6">Usuário: <span className="font-semibold text-slate-700">{solicitacaoSelecionada?.nome}</span></p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nova senha</label>
                  <input
                    type="password"
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Digite a nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar nova senha</label>
                  <input
                    type="password"
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Confirme a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>

              {erro && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4 border border-red-100">{erro}</p>}
              {sucesso && <p className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mt-4 border border-green-100">{sucesso}</p>}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={fecharModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarNovaSenha}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}