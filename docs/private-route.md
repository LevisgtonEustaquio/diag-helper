# PrivateRoute

## Responsabilidade
Proteger rotas que exigem autenticação e/ou perfil específico.

## Funcionamento

- Verifica se existe usuário autenticado
- Caso não exista, redireciona para `/`
- Se houver restrição de perfil:
  - Valida através do `hasPerfil`
  - Redireciona para `/dashboard` se não autorizado

## Benefícios
- Centraliza a lógica de segurança
- Evita duplicação de validações
- Facilita manutenção de permissões