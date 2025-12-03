import { useState, useEffect } from "react";
import Layout from "../components/Navbar"; // usa o Layout com sidebar

export default function Configuracoes() {
  // Preferências do usuário
  const [tema, setTema] = useState("claro");
  const [menuExpandido, setMenuExpandido] = useState(true);
  const [mostrarAvatar, setMostrarAvatar] = useState(true);

  // Dados do usuário
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nome: "Usuário",
    email: "email@exemplo.com",
  };

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);

  // Sistema
  const [logsAtivos, setLogsAtivos] = useState(true);
  const [tempoSessao, setTempoSessao] = useState(30);
  const [modoPrivado, setModoPrivado] = useState(false);

  // Salvar alterações
  function salvarPreferencias() {
    const novasPreferencias = {
      tema,
      menuExpandido,
      mostrarAvatar,
      logsAtivos,
      tempoSessao,
      modoPrivado,
    };

    localStorage.setItem("preferencias", JSON.stringify(novasPreferencias));

    const novoUsuario = { ...usuario, nome, email };
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));

    alert("Configurações salvas!");
  }

  // Limpar tudo
  function limparTudo() {
    if (confirm("Tem certeza que deseja apagar TODOS os dados do sistema?")) {
      localStorage.clear();
      alert("Todos os dados foram apagados!");
      window.location.reload();
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Configurações do Sistema
        </h1>

        {/* SEÇÃO 1 — Preferências */}
        <div className="bg-white p-6 shadow-md rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Preferências do Usuário</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tema */}
            <div>
              <label className="font-medium">Tema:</label>
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full border p-3 rounded-lg mt-2"
              >
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
              </select>
            </div>

            {/* Menu */}
            <div>
              <label className="font-medium">Menu lateral expandido:</label>
              <input
                type="checkbox"
                checked={menuExpandido}
                onChange={() => setMenuExpandido(!menuExpandido)}
                className="ml-2"
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="font-medium">Mostrar avatar:</label>
              <input
                type="checkbox"
                checked={mostrarAvatar}
                onChange={() => setMostrarAvatar(!mostrarAvatar)}
                className="ml-2"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2 — Conta */}
        <div className="bg-white p-6 shadow-md rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Dados da Conta</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            <div>
              <label className="font-medium">E-mail:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            <div>
              <label className="font-medium">Alterar senha:</label>
              <input
                type="password"
                placeholder="Digite uma nova senha"
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3 — Sistema */}
        <div className="bg-white p-6 shadow-md rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Ativar logs de auditoria:</label>
              <input
                type="checkbox"
                checked={logsAtivos}
                onChange={() => setLogsAtivos(!logsAtivos)}
                className="ml-2"
              />
            </div>

            <div>
              <label className="font-medium">Tempo da sessão (minutos):</label>
              <input
                type="number"
                value={tempoSessao}
                onChange={(e) => setTempoSessao(e.target.value)}
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            <div>
              <label className="font-medium">Modo de privacidade:</label>
              <input
                type="checkbox"
                checked={modoPrivado}
                onChange={() => setModoPrivado(!modoPrivado)}
                className="ml-2"
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={salvarPreferencias}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Salvar Configurações
          </button>

          <button
            onClick={limparTudo}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            Limpar Todos os Dados
          </button>
        </div>
      </div>
    </Layout>
  );
}
