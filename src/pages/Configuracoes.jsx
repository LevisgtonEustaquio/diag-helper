// import { useState } from "react";
// import { MdDeleteSweep, MdPerson, MdSave } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import PageWrapper from "../components/PageWrapper";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// export default function Configuracoes() {
//   const navigate = useNavigate();
//   const { usuario, login, logout } = useAuth();

//   // Bloqueio caso o estado do usuário suma
//   if (!usuario) {
//     return null;
//   }

//   /* ================= ESTADOS ================= */
//   const [nome, setNome] = useState(usuario?.nome || "");
//   const [emailAtual] = useState(usuario?.email || "");
//   const [novoEmail, setNovoEmail] = useState(usuario?.email || "");
//   const [novaSenha, setNovaSenha] = useState("");
//   const [confirmaSenha, setConfirmaSenha] = useState("");
//   const [erroSenha, setErroSenha] = useState("");

//   /* ================= SALVAR CONFIGURAÇÕES ================= */
//   const salvarConfiguracoes = async () => {
//     if (novaSenha && novaSenha !== confirmaSenha) {
//       setErroSenha("As senhas não coincidem!");
//       return;
//     }

//     try {
//       // MESCLAGEM: Mantém perfil/id e altera apenas nome/email/senha
//       const dadosCompletos = {
//         ...usuario,
//         nome: nome,
//         email: novoEmail,
//       };

//       if (novaSenha) {
//         dadosCompletos.senha = novaSenha;
//       }

//       const response = await api.put(`/usuarios/${usuario.id}`, dadosCompletos);
//       const usuarioAtualizado = response.data || response;

//       // Atualiza o estado global com o objeto que contém o perfil
//       login(usuarioAtualizado);

//       if (novaSenha) {
//         alert("Senha alterada com sucesso! Identificamos uma troca de senha, por favor faça login novamente.");
//         logout();
//         navigate("/");
//         return;
//       }

//       alert("Alterações salvas com sucesso!");
//       setNovaSenha("");
//       setConfirmaSenha("");
//       setErroSenha("");

//     } catch (err) {
//       console.error(err);
//       alert("Erro ao salvar alterações no servidor.");
//     }
//   };

//   const limparTudo = () => {
//     if (window.confirm("Deseja encerrar a sessão atual?")) {
//       logout();
//       navigate("/");
//     }
//   };

//   return (
//     <PageWrapper title="Configurações">
//       <div className="max-w-5xl mx-auto space-y-8 pb-12">
//         <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-blue-100 rounded-xl">
//               <MdPerson size={22} className="text-blue-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800">Dados da Conta</h2>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <Input label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
//             <Input label="E-mail atual" value={emailAtual} disabled />
//             <Input label="Novo e-mail" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
//             <Input 
//               label="Nova senha" 
//               type="password" 
//               value={novaSenha} 
//               onChange={e => setNovaSenha(e.target.value)} 
//               placeholder="Deixe em branco para manter"
//             />
//             <div>
//               <Input
//                 label="Confirmar nova senha"
//                 type="password"
//                 value={confirmaSenha}
//                 onChange={e => setConfirmaSenha(e.target.value)}
//               />
//               {erroSenha && <p className="text-red-500 text-sm mt-2 font-medium">{erroSenha}</p>}
//             </div>
//           </div>
//         </section>

//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <button
//             onClick={salvarConfiguracoes}
//             className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-md"
//           >
//             <MdSave size={20} /> Salvar alterações
//           </button>

//           <button
//             onClick={limparTudo}
//             className="flex items-center justify-center gap-2 px-6 py-4 border border-red-300 text-red-600 rounded-2xl hover:bg-red-50 transition font-semibold"
//           >
//             <MdDeleteSweep size={20} /> Sair da Conta
//           </button>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// function Input({ label, type = "text", ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</label>
//       <input
//         type={type}
//         className="border border-slate-300 p-3 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50 disabled:text-slate-400"
//         {...props}
//       />
//     </div>
//   );
// }

import { useState } from "react";
import { MdOutlineLock, MdOutlinePerson, MdDone, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { usuario, login, logout } = useAuth();

  if (!usuario) return null;

  /* ================= ESTADOS ================= */
  const [nome, setNome] = useState(usuario?.nome || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");

  /* ================= LÓGICA DE SALVAMENTO ================= */
  const salvarConfiguracoes = async () => {
    setErro("");

    // Validação de Segurança
    if (novaSenha || confirmaSenha) {
      if (!senhaAtual) return setErro("Informe a senha atual para autorizar a mudança.");
      if (senhaAtual !== usuario.senha) return setErro("A senha atual está incorreta.");
      if (novaSenha.length < 4) return setErro("A nova senha deve ter pelo menos 4 caracteres.");
      if (novaSenha !== confirmaSenha) return setErro("As novas senhas não coincidem.");
    }

    try {
      // Objeto blindado: Mantém perfil, id e email originais
      const dadosAtualizados = {
        ...usuario,
        nome,
        senha: novaSenha || usuario.senha
      };

      const response = await api.put(`/usuarios/${usuario.id}`, dadosAtualizados);
      login(response.data || response);

      if (novaSenha) {
        alert("Senha atualizada! Por favor, faça login novamente.");
        logout();
        navigate("/");
        return;
      }

      alert("Perfil atualizado com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmaSenha("");
    } catch (err) {
      setErro("Falha ao conectar com o servidor.");
    }
  };

  return (
    <PageWrapper title="Configurações do Perfil">
      <div className="max-w-4xl mx-auto mt-4 space-y-6 pb-10">
        
        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* HEADER DO CARD */}
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MdOutlinePerson className="text-blue-500" size={22} /> 
              Informações Pessoais
            </h2>
            <p className="text-sm text-slate-500">Gerencie seus dados de exibição e acesso.</p>
          </div>

          <div className="p-8 space-y-8">
            {/* LINHA 1: NOME E EMAIL */}
            <div className="grid md:grid-cols-2 gap-8">
              <Input 
                label="Nome Completo" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail de Acesso</label>
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed italic">
                  {usuario.email}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">* O e-mail não pode ser alterado.</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SEÇÃO DE SENHA */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <MdOutlineLock size={18} className="text-slate-400" /> Alterar Senha
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Input 
                  label="Senha Atual" 
                  type="password" 
                  value={senhaAtual} 
                  onChange={e => setSenhaAtual(e.target.value)}
                  placeholder="••••••••"
                />
                <Input 
                  label="Nova Senha" 
                  type="password" 
                  value={novaSenha} 
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Mín. 4 dígitos"
                />
                <Input 
                  label="Confirmar Nova Senha" 
                  type="password" 
                  value={confirmaSenha} 
                  onChange={e => setConfirmaSenha(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {erro && (
                <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-r-md">
                  {erro}
                </div>
              )}
            </div>
          </div>

          {/* RODAPÉ DE AÇÕES */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        

            <button
              onClick={salvarConfiguracoes}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
            >
              <MdDone size={20} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTE DE INPUT REUTILIZÁVEL */
function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-slate-200 p-2.5 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
        {...props}
      />
    </div>
  );
}