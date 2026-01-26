# Documentação das Páginas

Este documento descreve todas as páginas que compõem a aplicação frontend.
Algumas páginas possuem implementação completa documentada; outras estão
preparadas estruturalmente para expansão futura.

---

## Login.jsx

### Descrição
Página responsável pela autenticação do usuário no sistema.

### Funcionalidades
- Entrada de e-mail institucional e senha
- Validação de credenciais via API
- Bloqueio de usuários inativos
- Registro de auditoria de login
- Persistência da sessão
- Redirecionamento para o dashboard

### Dependências
- React Router
- AuthContext
- API Client
- Audit Service

---

## Suporte.jsx

### Descrição
Página destinada ao suporte técnico e recuperação de acesso.

### Funcionalidades
- Contato via WhatsApp
- Contato telefônico
- Envio de e-mail
- Solicitação direta ao administrador
- Armazenamento local das solicitações

### Persistência
As solicitações são armazenadas em `localStorage`.

---

## VisualizarImagens.jsx

### Descrição
Página estrutural para visualização de imagens do sistema.

### Status
🔧 Em desenvolvimento / preparada para expansão.

### Características
- Layout integrado com Navbar
- Estrutura base pronta para futura lógica de exibição

---

## Dashboard.jsx

### Descrição
Página inicial do usuário após autenticação.

### Função
- Centralizar acesso às funcionalidades do sistema
- Exibir informações principais conforme perfil do usuário

### Observação
Implementação não detalhada neste documento.

---

## Páginas Administrativas

### Descrição
Conjunto de páginas acessíveis apenas a usuários com perfil administrativo.

### Controle de Acesso
Protegidas por `PrivateRoute` com validação de perfil.

### Exemplos
- Gestão de usuários
- Visualização de logs de auditoria
- Configurações do sistema

---

## Outras Páginas

### Observação
O sistema pode conter páginas adicionais como:
- Cadastro
- Relatórios
- Configurações
- Visualizações específicas por perfil

Estas páginas seguem o mesmo padrão arquitetural descrito na documentação.