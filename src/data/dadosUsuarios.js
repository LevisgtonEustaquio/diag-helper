// desabilitado, estamos utilizando o db.json

// const STORAGE_KEY = 'appUsuarios'; 

// // Lista de usuários iniciais
// const USUARIOS_INICIAIS = [
//   {
//     nome: "Administrador Geral",
//     email: "admin@app.com",
//     senha: "123",
//     tipoUsuario: "administrador", 
//     crm: null, 
//   },
//   {
//     nome: "Dr. João",
//     email: "medico@teste.com",
//     senha: "123",
//     tipoUsuario: "medico",
//     crm: "CRM12345",
//   },
//   {
//     nome: "Maria de Souza",
//     email: "recepcao@teste.com",
//     senha: "123",
//     tipoUsuario: "recepcionista",
//     crm: null, 
//   },
// ];

// /**
//  * Carrega a lista de usuários do localStorage.
//  * Se for o primeiro acesso, inicializa o localStorage com USUARIOS_INICIAIS.
//  * @returns {Array<Object>} Lista de usuários.
//  */
// function carregarUsuarios() {
//   const usuariosSalvos = localStorage.getItem(STORAGE_KEY);
  
//   if (usuariosSalvos) {
//     return JSON.parse(usuariosSalvos);
//   } else {
//     // Inicializa e salva a lista padrão no localStorage
//     salvarUsuarios(USUARIOS_INICIAIS); 
//     return USUARIOS_INICIAIS;
//   }
// }

// /**
//  * Salva a lista completa de usuários no localStorage.
//  * @param {Array<Object>} usuarios - Lista de usuários a ser salva.
//  */
// function salvarUsuarios(usuarios) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
// }

// export {
//   carregarUsuarios,
//   salvarUsuarios,
// };