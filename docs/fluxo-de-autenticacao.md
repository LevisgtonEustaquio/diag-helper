# Fluxo de Autenticação

## Etapas do Login

1. Usuário insere e-mail e senha
2. Sistema consulta a API de usuários
3. Verificação de credenciais
4. Validação de status do usuário
5. Registro de auditoria
6. Armazenamento da sessão
7. Redirecionamento para o dashboard

## Segurança
- Validação de usuário inativo
- Controle de acesso por perfil
- Rotas privadas protegidas

## Persistência
A sessão é mantida via `localStorage`, garantindo:
- Persistência após reload
- Recuperação automática do estado