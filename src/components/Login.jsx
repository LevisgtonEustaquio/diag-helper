import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdPerson, MdLogin, MdHelpOutline } from "react-icons/md";
import { registrarLog } from "../services/auditService"; 
import api from "../services/api"; 

import logo from "../assets/3.svg";

export default function Login() {
  const [formData, setFormData] = useState({
    perfil: "", // Alinhado com o campo 'perfil' do seu CadastroUsuario
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    try {
      // Normaliza o e-mail 
      const emailBusca = formData.email.trim().toLowerCase();
      
      // Busca o usuário por e-mail e senha no db.json através da API
      const res = await api.get(`/usuarios?email=${emailBusca}&senha=${formData.senha}`);
      const usuario = res.data[0];

      if (!usuario) {
        setMensagem("Credenciais inválidas ou e-mail/senha incorretos.");
        setCarregando(false);
        return;
      }


      // Verificação de Status
      if (usuario.status === "Inativo") {
        setMensagem("Este usuário está inativo. Contate o administrador.");
        setCarregando(false);
        return;
      }

      // --- SUCESSO NO LOGIN ---
      // Registro de Auditoria
      await registrarLog(usuario.nome, "Realizou login no sistema", "LOGIN");

      // Salva no LocalStorage para manter a sessão no Diag Helper
      localStorage.setItem("usuarioNome", usuario.nome);
      localStorage.setItem("usuarioPerfil", usuario.perfil);
      // localStorage.setItem("usuario", JSON.stringify(usuario));
      // Adiciona 'role' baseado no 'perfil' do usuário
const usuarioParaNavbar = { ...usuario, role: usuario.perfil };
localStorage.setItem("usuario", JSON.stringify(usuarioParaNavbar));


      // Pequeno delay para o feedback do carregando antes de navegar
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);

    } catch (err) {
      console.error("Erro no login:", err);
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[550px]">
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesse sua conta</h2>
            <p className="text-sm text-slate-500">Insira suas credenciais institucionais.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      
            {/* Email */}
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail institucional"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            {mensagem && (
              <p className="text-sm text-red-600 font-semibold text-center bg-red-50 p-2 rounded border border-red-100">
                {mensagem}
              </p>
            )}

            <button
              disabled={carregando}
              className="bg-blue-600 text-white rounded-lg py-3 mt-2 font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98] cursor-pointer"
              type="submit"
            >
              {carregando ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <MdLogin size={20} /> Entrar
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/suporte")}
              className="text-blue-600 hover:underline mt-4 text-center text-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <MdHelpOutline size={16} />
              Esqueci minha senha / Suporte
            </button>
          </form>
        </div>

        {/* LADO DIREITO: LOGO COM EFEITOS VISUAIS */}
        <div className="hidden md:flex w-1/2 bg-primary-500 items-center justify-center text-white flex-col p-12 relative overflow-hidden">
           {/* Elemento Decorativo: Círculos de fundo */}
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-600 rounded-full opacity-50 shadow-inner" />
           <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-primary-700 rounded-full opacity-30" />
          
           <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md mb-8">
               <img src={logo} alt="Logo" className="w-48 brightness-0" />
             </div>
             <h2 className="text-4xl font-black text-text-primary mb-4 text-center">Gestão Médica Inteligente</h2>
             <p className="text-center text-text-primary text-lg max-w-[280px]">
               Tudo o que você precisa para gerenciar sua clínica em um só lugar.
            </p>
           </div>
         </div>

      </div>
    </div>
  );
}