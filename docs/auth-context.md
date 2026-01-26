# AuthContext

## Responsabilidade
Gerenciar o estado global de autenticação do usuário.

## Funcionalidades
- Armazenar usuário autenticado
- Persistir sessão no `localStorage`
- Fornecer funções de login e logout
- Validar permissões por perfil

## Estados
- `usuario`: objeto do usuário autenticado ou `null`

## Funções Principais

### login(userObj)
Armazena o usuário no estado global e no `localStorage`.

### logout()
Remove o usuário do estado global e limpa o `localStorage`.

### hasPerfil(perfisPermitidos)
Valida se o usuário possui um dos perfis autorizados.
A função normaliza strings para evitar erros com acentuação.

## Observações Técnicas
- O contexto evita múltiplas leituras do `localStorage`
- Centraliza regras de autenticação e autorização