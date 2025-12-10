import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Layout from "../components/Navbar";
import { carregarUsuarios, salvarUsuarios } from "../data/dadosUsuarios"; 

export default function Configuracoes() {
  const navigate = useNavigate(); 
  
  //CARREGAMENTO DE DADOS E ESTADOS INICIAIS
  
  const usuarioLocalStorage = JSON.parse(localStorage.getItem("usuario")) || {
    nome: "Usuário",
    email: "",
    tipoUsuario: "deslogado",
  };

  // Preferências do usuário
  const [tema, setTema] = useState("claro");
  const [menuExpandido, setMenuExpandido] = useState(true);
  const [mostrarAvatar, setMostrarAvatar] = useState(true);

  // Dados do usuário logado (Campos para alteração)
  const [nome, setNome] = useState(usuarioLocalStorage.nome || "");
  const [emailAtual, setEmailAtual] = useState(usuarioLocalStorage.email || ""); 
  const [novoEmail, setNovoEmail] = useState(usuarioLocalStorage.email || "");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  // Permissão do usuário logado
  const ehAdministrador = usuarioLocalStorage.tipoUsuario === "administrador";

  // Sistema
  const [logsAtivos, setLogsAtivos] = useState(true);
  const [tempoSessao, setTempoSessao] = useState(30);
  const [modoPrivado, setModoPrivado] = useState(false);

  // Estado para o Formulário de Cadastro de Novo Usuário (Apenas o administrador)
  const [novoUserFormData, setNovoUserFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    tipoUsuario: "medico",
    crm: "",
  });
  const [erroNovoUser, setErroNovoUser] = useState("");
  
  const handleNovoUserChange = (e) => {
    setNovoUserFormData({ ...novoUserFormData, [e.target.name]: e.target.value });
    setErroNovoUser("");
  };

  //FUNÇÕES DE SALVAMENTO E LÓGICA

  function salvarConfiguracoes() {
    let deveFazerLogout = false;
    
    // Lógica de validação de senha para o usuário logado
    if (novaSenha && novaSenha !== confirmaSenha) {
      setErroSenha("As senhas não coincidem!");
      alert("Erro ao salvar: as senhas não coincidem.");
      return;
    }
    setErroSenha("");

    // Salvar as Preferências do Usuário (Local)
    const novasPreferencias = { tema, menuExpandido, mostrarAvatar, logsAtivos, tempoSessao, modoPrivado };
    localStorage.setItem("preferencias", JSON.stringify(novasPreferencias));

    // Atualizar Dados da Conta (Persistente no BD Fake)
    let atualizacaoNecessaria = nome !== usuarioLocalStorage.nome || novoEmail !== emailAtual || novaSenha.length > 0;

    if (atualizacaoNecessaria) {
      const todosUsuarios = carregarUsuarios();
      const usuarioIndex = todosUsuarios.findIndex(u => u.email === emailAtual);

      if (usuarioIndex !== -1) {
        let usuarioAtualizado = todosUsuarios[usuarioIndex];

        // Atualiza Nome
        usuarioAtualizado.nome = nome;

        // Atualiza Email (se alterado)
        if (novoEmail !== emailAtual) {
          const emailJaExiste = todosUsuarios.some((u, index) => index !== usuarioIndex && u.email === novoEmail);
          if (emailJaExiste) {
            alert("Erro: O novo email já está sendo usado por outro usuário.");
            return;
          }
          usuarioAtualizado.email = novoEmail;
        }

        // Atualiza Senha (se preenchida)
        if (novaSenha) {
          usuarioAtualizado.senha = novaSenha; 
          deveFazerLogout = true; 
        }

        // Salva a lista completa de usuários atualizada
        todosUsuarios[usuarioIndex] = usuarioAtualizado;
        salvarUsuarios(todosUsuarios);

        // Atualiza o localStorage do usuário logado (sessão)
        const novoUsuarioSessao = {
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email,
          tipoUsuario: usuarioAtualizado.tipoUsuario
        };
        localStorage.setItem("usuario", JSON.stringify(novoUsuarioSessao));
        setEmailAtual(novoUsuarioSessao.email);
        setNovoEmail(novoUsuarioSessao.email);
        setNovaSenha("");
        setConfirmaSenha("");

      } else {
        alert("Erro: Usuário não encontrado no banco de dados.");
        return;
      }
    }
    
    alert("Configurações salvas com sucesso!");
    
    // Implementação da regra 1: Fazer logout após alterar a senha
    if (deveFazerLogout) {
        localStorage.removeItem('usuario');
        navigate("/"); 
    }
  }

  // Lógica para cadastrar novo usuário (Apenas administrador)
  const cadastrarNovoUsuario = (e) => {
    e.preventDefault();
    const { nome, email, senha, confirmaSenha, tipoUsuario, crm } = novoUserFormData; //Destructuring crm

    // Validação básica de campos
    if (!nome || !email || !senha || !confirmaSenha) {
      setErroNovoUser("Preencha todos os campos, incluindo a confirmação de senha.");
      return;
    }
    
    // ⬅️ Validação do CRM (Obrigatório se for médico)
    if (tipoUsuario === 'medico' && !crm) {
        setErroNovoUser("O campo CRM é obrigatório para usuários do tipo Médico.");
        return;
    }
    
    // Implementação da regra 2: Confirmação de senha no cadastro
    if (senha !== confirmaSenha) {
      setErroNovoUser("As senhas não coincidem no formulário de cadastro.");
      return;
    }
    setErroNovoUser("");

    const todosUsuarios = carregarUsuarios();

    // Verifica se o email já existe
    if (todosUsuarios.some(u => u.email === email)) {
      setErroNovoUser("Erro: Este e-mail já está sendo usado por outro usuário.");
      return;
    }

    //Criação do novo objeto usuário, incluindo o campo CRM condicionalmente
    const novoUsuario = { 
        nome, 
        email, 
        senha, 
        tipoUsuario,
        // O CRM só é salvo se o tipo for 'medico', caso contrário é 'null'
        crm: tipoUsuario === 'medico' ? crm : null, 
    };

    const novaLista = [...todosUsuarios, novoUsuario];
    salvarUsuarios(novaLista);

 
    setNovoUserFormData({ 
        nome: "", 
        email: "", 
        senha: "", 
        confirmaSenha: "", 
        tipoUsuario: "medico",
        crm: "", 
    });
    alert(`Usuário ${novoUsuario.nome} do tipo ${novoUsuario.tipoUsuario} cadastrado com sucesso!`);
  }

  
  function limparTudo() {
    if (confirm("Tem certeza que deseja apagar os dados de Sessão e Preferências? (A lista de usuários cadastrados será MANTIDA)")) {
      //Remove apenas as chaves de sessão e preferências, preservando 'appUsuarios'
      localStorage.removeItem("preferencias");
      localStorage.removeItem("usuario");

      alert("Dados de Sessão e Preferências foram apagados!");
      navigate("/"); // Redireciona para a tela de login
    }
  }


  //RENDERIZAÇÃO (JSX)
  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Configurações do Sistema
        </h1>
        
        {/*SEÇÃO NOVO CADASTRO (Apenas administrador) */}
        {ehAdministrador && (
          <div className="bg-white p-6 shadow-md shadow-primary-400 rounded-xl mb-8 border-l-4 border-primary-400">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              Cadastro de Novo Usuário
            </h2>

            <form onSubmit={cadastrarNovoUsuario} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={novoUserFormData.nome}
                  onChange={handleNovoUserChange}
                  className="w-full border p-3 rounded-lg mt-2"
                  required
                />
              </div>
              <div>
                <label className="font-medium">E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={novoUserFormData.email}
                  onChange={handleNovoUserChange}
                  className="w-full border p-3 rounded-lg mt-2"
                  required
                />
              </div>
              <div>
                <label className="font-medium">Tipo de Usuário:</label>
                <select
                  name="tipoUsuario"
                  value={novoUserFormData.tipoUsuario}
                  onChange={handleNovoUserChange}
                  className="w-full border p-3 rounded-lg mt-2"
                >
                  <option value="medico">Médico</option>
                  <option value="recepcionista">Recepcionista</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              
              {/* CAMPO CRM CONDICIONALMENTE RENDERIZADO */}
              {novoUserFormData.tipoUsuario === 'medico' && (
                <div>
                  <label className="font-medium">CRM:</label>
                  <input
                    type="text"
                    name="crm"
                    value={novoUserFormData.crm}
                    onChange={handleNovoUserChange}
                    className="w-full border p-3 rounded-lg mt-2"
                    required // Torna o campo obrigatório para a validação do browser
                  />
                </div>
              )}
              
              {/* Senha */}
              <div>
                <label className="font-medium">Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={novoUserFormData.senha}
                  onChange={handleNovoUserChange}
                  className="w-full border p-3 rounded-lg mt-2"
                  required
                />
              </div>
              
              {/* Confirmação de Senha */}
              <div>
                <label className="font-medium">Confirme a Senha:</label>
                <input
                  type="password"
                  name="confirmaSenha"
                  value={novoUserFormData.confirmaSenha}
                  onChange={handleNovoUserChange}
                  className="w-full border p-3 rounded-lg mt-2"
                  required
                />
              </div>

              {erroNovoUser && (
                <p className="text-red-500 text-sm mt-1 col-span-3">
                    {erroNovoUser}
                </p>
              )}
              
              <div className="md:col-span-2 lg:col-span-3 pt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-400 text-slate-900 rounded-lg shadow-md hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/*SEÇÃO ALTERAÇÃO DE CADASTRO (Para Todos) */}
        <div className="bg-white p-6 shadow-md rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Alteração de Cadastro</h2>
          {/* ... (o JSX para alteração de cadastro) ... */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Campo Nome */}
            <div>
              <label className="font-medium">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            {/* Campo E-mail Atual (Apenas Exibição) */}
            <div>
              <label className="font-medium">E-mail Atual:</label>
              <input
                type="text"
                value={emailAtual}
                readOnly
                className="w-full border p-3 rounded-lg mt-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Campo Novo E-mail */}
            <div>
              <label className="font-medium">Novo E-mail:</label>
              <input
                type="email"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                placeholder="Digite o novo e-mail"
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            {/* Campo Nova Senha */}
            <div>
              <label className="font-medium">Nova Senha:</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Deixe vazio para manter a senha"
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>

            {/* Campo Confirmação de Senha */}
            <div>
              <label className="font-medium">Confirme a Nova Senha:</label>
              <input
                type="password"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full border p-3 rounded-lg mt-2"
              />
              {erroSenha && (
                <p className="text-red-500 text-sm mt-1">{erroSenha}</p>
              )}
            </div>
          </div>
        </div>


        {/* SEÇÃO PREFERÊNCIAS (Original) */}
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

        {/* SEÇÃO SISTEMA */}
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

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={salvarConfiguracoes}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 cursor-pointer"
          >
            Salvar Configurações
          </button>

          <button
            onClick={limparTudo}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
          >
            Limpar Sessão e Preferências
          </button>
        </div>
      </div>
    </Layout>
  );
}