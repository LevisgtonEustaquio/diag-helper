/**
 * Constantes da aplicação
 * Centralize valores fixos aqui para facilitar manutenção
 */

// Perfis de usuário
export const PERFIS = {
    ADMINISTRADOR: 'administrador',
    MEDICO: 'medico',
    RECEPCIONISTA: 'recepcionista',
};

// Status de usuário
export const STATUS_USUARIO = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo',
};

// Tipos de log de auditoria
export const TIPOS_LOG = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CADASTRO: 'CADASTRO',
    EDICAO: 'EDIÇÃO',
    EXCLUSAO: 'EXCLUSÃO',
    LAUDO: 'LAUDO',
    INFO: 'INFO',
    ERRO: 'ERRO',
    GERAL: 'GERAL',
};

// Status de requisição
export const REQUEST_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Configurações de debounce (em ms)
export const DEBOUNCE_DELAYS = {
    SEARCH: 300,
    INPUT: 500,
    AUTOSAVE: 1000,
};

// Mensagens de validação
export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'E-mail inválido',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
    EMAILS_DONT_MATCH: 'Os e-mails não coincidem',
    INVALID_CPF: 'CPF inválido',
    INVALID_PHONE: 'Telefone inválido',
    MIN_PASSWORD_LENGTH: 'A senha deve ter no mínimo 6 caracteres',
};

// Regex para validações
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
};
