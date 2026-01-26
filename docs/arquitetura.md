# Arquitetura do Sistema

## Visão Geral
Este projeto é uma aplicação frontend desenvolvida em **React**, utilizando uma arquitetura baseada em **componentes**, **contextos globais** e **serviços desacoplados** para comunicação com API.

A aplicação segue os princípios de:
- Separação de responsabilidades
- Reutilização de código
- Facilidade de manutenção
- Escalabilidade

## Camadas da Aplicação

### 1. Apresentação (Pages & Components)
Responsável pela interface com o usuário.
- Páginas (`/pages`)
- Componentes reutilizáveis (`/components`)
- Estilização com Tailwind CSS

### 2. Gerenciamento de Estado Global
Realizado através do **React Context API**, centralizando:
- Autenticação
- Sessão do usuário
- Controle de permissões

### 3. Serviços
Camada responsável pela comunicação com APIs externas.
- Cliente HTTP unificado
- Serviços de auditoria
- Isolamento da lógica de rede

### 4. Roteamento e Segurança
- React Router DOM
- Rotas privadas com controle de perfil (RBAC)

## Persistência de Dados
- Sessão do usuário armazenada em `localStorage`
- Logs de auditoria enviados para API
- Solicitações de suporte persistidas localmente