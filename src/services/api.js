// import axios from 'axios';
// import { registrarLog } from './auditService';

// const api = axios.create({
//   baseURL: 'http://localhost:3001', // Sua URL base do json-server
// });

// // Interceptor de Resposta: Registra log após o sucesso da operação
// api.interceptors.response.use(
//   (response) => {
//     const { method, url } = response.config;

//     // Filtramos para registrar apenas ações de alteração (POST, PUT, DELETE)
//     // E evitamos registrar o próprio log para não entrar em loop infinito
//     if (['post', 'put', 'delete'].includes(method.toLowerCase()) && !url.includes('LogsAuditoria')) {
      
//       // Pegamos o usuário do localStorage (ajuste conforme sua lógica de login)
//       const usuarioLogado = localStorage.getItem('usuarioNome') || 'Usuário Desconhecido';
      
//       const acao = `Realizou ${method.toUpperCase()} na rota ${url}`;
//       const tipo = 'INFO';

//       registrarLog(usuarioLogado, acao, tipo);
//     }

//     return response;
//   },
//   (error) => {
//     // Registrar tentativas que falharam (importante para segurança)
//     const usuarioLogado = localStorage.getItem('usuarioNome') || 'Usuário Desconhecido';
//     const acao = `FALHA: ${error.config?.method.toUpperCase()} em ${error.config?.url}`;
    
//     registrarLog(usuarioLogado, acao, 'ERRO');

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';
import { registrarLog } from './auditService';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.response.use(
  (response) => {
    const { method, url, data: requestData } = response.config;

    // Log automático apenas para POST e DELETE. 
    // O PUT (edição) é feito manualmente no componente para detalhar o que mudou.
    if (['post', 'delete'].includes(method.toLowerCase()) && !url.includes('LogsAuditoria')) {
      const usuarioLogado = localStorage.getItem('usuarioNome') || 'Usuário Desconhecido';
      
      let detalhe = "";
      if (method.toLowerCase() === 'delete') {
        detalhe = `ID: ${url.split('/').pop()}`;
      } else {
        const dados = typeof requestData === 'string' ? JSON.parse(requestData) : requestData;
        detalhe = dados.nome ? `Paciente: ${dados.nome}` : "";
      }

      registrarLog(usuarioLogado, `Realizou ${method.toUpperCase()} (${detalhe})`, 'INFO');
    }
    return response;
  },
  (error) => {
    const usuarioLogado = localStorage.getItem('usuarioNome') || 'Usuário Desconhecido';
    registrarLog(usuarioLogado, `ERRO: ${error.config?.method.toUpperCase()} em ${error.config?.url}`, 'ERRO');
    return Promise.reject(error);
  }
);

export default api; 