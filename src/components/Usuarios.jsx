import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Layout from "../components/Navbar";
import { carregarUsuarios, salvarUsuarios } from "../data/dadosUsuarios"; 

export default function Usuarios() {
  const ehAdministrador = true; // exemplo
  const [novoUserFormData, setNovoUserFormData] = useState({ nome: "", email: "", senha: "", confirmaSenha: "", tipoUsuario: "medico" });
  const [erroNovoUser, setErroNovoUser] = useState("");

  const handleNovoUserChange = (e) => {
    setNovoUserFormData({ ...novoUserFormData, [e.target.name]: e.target.value });
    setErroNovoUser("");
  };

  const cadastrarNovoUsuario = (e) => {
    e.preventDefault();
    // lógica de cadastro...
  };

  return (
    <div>
      {ehAdministrador && (
        <div className="bg-white p-6 shadow-md rounded-xl mb-8 border-l-4 border-primary-400">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Cadastro de Novo Usuário</h2>

          <form onSubmit={cadastrarNovoUsuario} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-medium">Nome:</label>
              <input type="text" name="nome" value={novoUserFormData.nome} onChange={handleNovoUserChange} className="w-full border p-3 rounded-lg mt-2" required />
            </div>
            <div>
              <label className="font-medium">E-mail:</label>
              <input type="email" name="email" value={novoUserFormData.email} onChange={handleNovoUserChange} className="w-full border p-3 rounded-lg mt-2" required />
            </div>
            <div>
              <label className="font-medium">Tipo de Usuário:</label>
              <select name="tipoUsuario" value={novoUserFormData.tipoUsuario} onChange={handleNovoUserChange} className="w-full border p-3 rounded-lg mt-2">
                <option value="medico">Médico Laudista</option>
                 <option value="medico">Médico Assistente</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Senha:</label>
              <input type="password" name="senha" value={novoUserFormData.senha} onChange={handleNovoUserChange} className="w-full border p-3 rounded-lg mt-2" required />
            </div>
            <div>
              <label className="font-medium">Confirme a Senha:</label>
              <input type="password" name="confirmaSenha" value={novoUserFormData.confirmaSenha} onChange={handleNovoUserChange} className="w-full border p-3 rounded-lg mt-2" required />
            </div>

            {erroNovoUser && (
              <p className="text-red-500 text-sm mt-1 col-span-3">{erroNovoUser}</p>
            )}

            <div className="md:col-span-2 lg:col-span-3 pt-6">
              <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors cursor-pointer">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
