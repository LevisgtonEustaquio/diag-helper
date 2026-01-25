import { useState } from "react";
import { MdDeleteSweep, MdPerson, MdSave } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { usuario, login, logout } = useAuth();

  if (!usuario) {
    navigate("/");
  }

  /* ================= ESTADOS ================= */
  const [nome, setNome] = useState(usuario?.nome || "");
  const [emailAtual] = useState(usuario?.email || "");
  const [novoEmail, setNovoEmail] = useState(usuario?.email || "");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  /* ================= SALVAR CONFIGURAÇÕES ================= */
  const salvarConfiguracoes = async () => {
    if (novaSenha && novaSenha !== confirmaSenha) {
      setErroSenha("As senhas não coincidem!");
      return;
    }

    setErroSenha("");

    const dadosAtualizados = {
      nome,
      email: novoEmail,
      ...(novaSenha && { senha: novaSenha })
    };

    try {
      const usuarioAtualizado = await api.put(`/usuarios/${usuario.id}`, dadosAtualizados);

      login({
        ...usuario,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email
      });

      alert("Alterações salvas com sucesso!");

      if (novaSenha) {
        logout();
        navigate("/");
      }

      setNovaSenha("");
      setConfirmaSenha("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações");
    }
  };

  /* ================= LIMPAR DADOS ================= */
  const limparTudo = () => {
    if (confirm("Deseja sair e limpar todos os dados?")) {
      logout();
      navigate("/");
    }
  };

  /* ================= RENDER ================= */
  return (
    <PageWrapper title="Configurações">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">

        {/* PERFIL */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <MdPerson size={22} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Dados da Conta
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
            <Input label="E-mail atual" value={emailAtual} disabled />
            <Input label="Novo e-mail" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
            <Input label="Nova senha" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />

            <div>
              <Input
                label="Confirmar senha"
                type="password"
                value={confirmaSenha}
                onChange={e => setConfirmaSenha(e.target.value)}
              />
              {erroSenha && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {erroSenha}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* AÇÕES */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">

          <button
            onClick={salvarConfiguracoes}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 
            bg-linear-to-r from-slate-800 to-slate-900 
            text-white rounded-2xl font-bold 
            hover:opacity-90 transition shadow-md"
          >
            <MdSave size={20} /> Salvar alterações
          </button>

          <button
            onClick={limparTudo}
            className="flex items-center justify-center gap-2 px-6 py-4 
            border border-red-300 text-red-600 
            rounded-2xl hover:bg-red-50
            transition font-semibold"
          >
            <MdDeleteSweep size={20} /> Limpar dados
          </button>

        </div>
      </div>
    </PageWrapper>
  );
}

/* ================= COMPONENTES ================= */

function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>

      <input
        type={type}
        className="
          border border-slate-300
          p-3 rounded-xl 
          bg-white
          text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition
        "
        {...props}
      />
    </div>
  );
}
