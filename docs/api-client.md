# API Client

## Descrição
Cliente HTTP customizado baseado em `fetch`, encapsulando:
- Base URL
- Headers
- Autenticação
- Tratamento de erros
- Logs

## Métodos Disponíveis
- `get(path)`
- `post(path, data)`
- `put(path, data)`
- `delete(path)`

## Tratamento de Erros
- Erros HTTP lançam exceções
- Retorno do body do erro disponível
- Logger opcional para auditoria

## Vantagens
- Código centralizado
- Reutilização
- Padronização das requisições