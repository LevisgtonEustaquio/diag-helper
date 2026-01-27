# Diag Helper - Sistema de Gestão Médica Inteligente – Frontend

Diag Helper é uma aplicação desenvolvida em React com Vite, projetada para auxiliar na gestão de diagnósticos médicos. A aplicação oferece funcionalidades como cadastro de pacientes, geração de laudos, visualização de laudos e muito mais, com uma interface moderna e responsiva.

Projeto desenvolvido com o objetivo de aplicar conceitos práticos de **desenvolvimento frontend**, **arquitetura de software**, **autenticação**, **controle de acesso** e **integração com APIs REST**.

A aplicação simula um sistema de gestão para clínicas médicas, oferecendo controle de usuários, autenticação segura, auditoria de ações e organização modular do código.

---

## Visão Geral

O sistema foi desenvolvido utilizando **React**, com foco em:
- Organização e escalabilidade
- Boas práticas de desenvolvimento
- Separação de responsabilidades
- Código legível e documentado

Este repositório contém **apenas o frontend** da aplicação.

---

## Tecnologias Utilizadas

- **React** (Vite)
- **React Router DOM**
- **Context API**
- **Tailwind CSS**
- **Fetch API**
- **Lucide Icons / React Icons**
- **LocalStorage** (persistência de sessão e dados auxiliares)

---

## Arquitetura do Projeto

A aplicação segue uma arquitetura baseada em camadas:

- **Pages**: Páginas principais do sistema
- **Components**: Componentes reutilizáveis de interface
- **Context**: Gerenciamento de estado global (autenticação)
- **Services**: Comunicação com APIs e auditoria
- **Utils / Hooks**: Funções auxiliares e hooks customizados

A documentação técnica detalhada está disponível na pasta [`/docs`](./docs).

---

## Estrutura de Pastas

~~~text
src/
├── assets/        # Imagens, ícones e arquivos estáticos
├── components/    # Componentes reutilizáveis
├── context/       # Contextos globais (AuthContext)
├── hooks/         # Hooks customizados
├── pages/         # Páginas da aplicação
├── services/      # Cliente de API e auditoria
├── styles/        # Estilos globais
├── utils/         # Funções utilitárias
~~~

---

## Autenticação e Autorização

O sistema utiliza:
- **Context API** para controle de sessão
- Persistência do usuário no `localStorage`
- **Rotas privadas** para proteção de páginas sensíveis
- **Controle de acesso por perfil (RBAC)**

Usuários inativos são impedidos de acessar o sistema.

---

## Fluxo de Login (Resumo)

1. Usuário informa e-mail e senha
2. Sistema consulta a API de usuários
3. Valida credenciais e status
4. Registra ação de auditoria
5. Armazena sessão
6. Redireciona para o dashboard

---

## Auditoria

O sistema possui um **serviço de auditoria**, responsável por registrar ações relevantes como:
- Login de usuários
- Ações administrativas
- Eventos críticos do sistema

Os registros são enviados para a API via um serviço dedicado.

---

## Persistência Local

Utilizada para:
- Sessão do usuário autenticado
- Solicitações de suporte
- Recuperação automática de estado após reload

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão LTS)
- NPM ou Yarn

### Instalação

```bash
npm install

1. Clone o repositório:
```bash
git clone https://github.com/heliobentzen/diag-helper.git
```

2. Acesse o diretório do projeto:
```bash 
cd diag-helper
```

3. Instale as dependências:
```bash
npm install 
```

4. Inicie o servidor de desenvolvimento:
```bash 
npm run dev
```

### Licença
Este projeto está sob a licença MIT.