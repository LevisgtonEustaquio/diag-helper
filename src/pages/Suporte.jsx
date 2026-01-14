import { Mail, Phone, MessageCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Suporte() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [feedback, setFeedback] = useState("");

  function enviarSolicitacao() {
    if (!nome || !email) {
      setFeedback("Preencha nome e e-mail.");
      return;
    }

    const solicitacoes =
      JSON.parse(localStorage.getItem("solicitacoesSuporte")) || [];

    solicitacoes.push({
      id: Date.now(),
      tipo: "suporte",
      nome,
      email,
      mensagem,
      status: "pendente",
      data: new Date().toLocaleString(),
    });

    localStorage.setItem("solicitacoesSuporte", JSON.stringify(solicitacoes));

    setFeedback("Solicitação enviada com sucesso!");
    setNome("");
    setEmail("");
    setMensagem("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white shadow-2xl shadow-slate-200 rounded-[2rem] p-8 md:p-10 max-w-lg w-full border border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-slate-500 mb-8 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <div className="bg-slate-100 group-hover:bg-blue-50 p-2 rounded-full mr-3 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Voltar para o login
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <LifeBuoy size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Precisa de Ajuda?
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Escolha um canal abaixo para falar com nossa equipe técnica.
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between group hover:bg-emerald-700 transition-all"
            onClick={() =>
              window.open("https://wa.me/5511999999999", "_blank")
            }
          >
            <div className="flex items-center gap-4 font-bold">
              <MessageCircle size={24} />
              WhatsApp Suporte
            </div>
            <span className="text-xs bg-emerald-500 px-2 py-1 rounded-md">
              Online
            </span>
          </button>

          <button
            className="w-full border-2 border-slate-100 bg-white p-4 rounded-2xl flex items-center gap-4 font-bold"
            onClick={() => (window.location.href = "tel:+5511999999999")}
          >
            <Phone size={22} className="text-blue-600" />
            Ligar agora
          </button>

          <button
            className="w-full border-2 border-slate-100 bg-white p-4 rounded-2xl flex items-center gap-4 font-bold"
            onClick={() => (window.location.href = "mailto:suporte@clinic.com")}
          >
            <Mail size={22} className="text-blue-600" />
            Enviar e-mail
          </button>
        </div>

        <div className="mt-10 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-center text-sm text-blue-800 font-medium">
            🔑 Para <strong>recuperação de senha</strong>, tenha em mãos seu{" "}
            <strong>CPF ou E-mail</strong>.
          </p>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="font-bold text-lg mb-4 text-slate-700">
            Solicitação para o administrador
          </h2>

          <input
            type="text"
            placeholder="Seu nome"
            className="w-full border rounded-lg p-2 mb-3"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            className="w-full border rounded-lg p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Descreva o problema (opcional)"
            className="w-full border rounded-lg p-2 mb-3"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          {feedback && (
            <p className="text-sm text-center mb-3 text-blue-600">{feedback}</p>
          )}

          <button
            onClick={enviarSolicitacao}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar solicitação
          </button>
        </div>
      </div>
    </div>
  );
}
