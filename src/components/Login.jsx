import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { salvarLog } from "../modals/salvaLogs";


export default function Login() {
  const [formData, setFormData] = useState({
    tipoUsuario: "",
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // Usuários simulados sem backend
  const usuariosFake = [
    {
      nome: "Administrador Fulano",
      email: "admin@teste.com",
      senha: "123",
      tipoUsuario: "administrador",
    },
    {
      nome: "Dr. João",
      email: "medico@teste.com",
      senha: "123",
      tipoUsuario: "medico",
    },
    {
      nome: "Maria de Solza",
      email: "recepcao@teste.com",
      senha: "123",
      tipoUsuario: "recepcionista",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("");

    const usuario = usuariosFake.find(
      (u) =>
        u.email === formData.email &&
        u.senha === formData.senha &&
        u.tipoUsuario === formData.tipoUsuario
    );

    if (!usuario) {
      setMensagem("Credenciais inválidas ou tipo de usuário incorreto.");
      return;
    }

    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">

        {/* FORMULÁRIO */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
            Acesse sua conta
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Quem está acessando?</option>
              <option value="administrador">Administrador</option>
              <option value="medico">Médico</option>
              <option value="recepcionista">Recepcionista</option>
            </select>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail institucional"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            {mensagem && (
              <p className="text-center text-red-600 font-semibold">
                {mensagem}
              </p>
            )}

            <button
              className="text-center bg-primary-600 text-white rounded-lg p-2 mt-2 hover:bg-primary-700 transition-all cursor-pointer"
              type="submit"
            >
              Entrar
            </button>

          </form>
        </div>

        {/* ILUSTRAÇÃO */}
        <div className="hidden md:flex w-1/2 bg-primary-400 items-center justify-center text-slate-900 flex-col p-8">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
          <p className="text-center ">
            Acesse o sistema com suas credenciais.
          </p>
        </div>
      </div>



  

    </div>
  );
}
