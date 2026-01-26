# Estrutura do Projeto

## Organização de Pastas
~~~text
src/
├── assets/ # Imagens, ícones e arquivos estáticos
├── components/ # Componentes reutilizáveis
├── context/ # Contextos globais (AuthContext)
├── hooks/ # Hooks customizados
├── pages/ # Páginas da aplicação
├── services/ # Serviços de API e auditoria
├── styles/ # Estilos globais
├── utils/ # Funções utilitárias
~~~

## Princípios Adotados
- **Alta coesão**: cada arquivo possui uma única responsabilidade
- **Baixo acoplamento**: páginas não acessam diretamente APIs
- **Padronização**: nomes claros e organização previsível