/**
 * Utilitário centralizado para tratamento de erros
 */

/**
 * Registra erro apenas em ambiente de desenvolvimento
 * @param {string} context - Contexto do erro (ex: "Login", "Dashboard")
 * @param {Error} error - Objeto de erro
 */
export const logError = (context, error) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${context}]`, error);
    }
    // Em produção, você pode enviar para um serviço de monitoramento como Sentry
};

/**
 * Retorna mensagem de erro amigável baseada no status HTTP
 * @param {Error} error - Objeto de erro da API
 * @returns {string} Mensagem de erro amigável
 */
export const getErrorMessage = (error) => {
    if (!error) return 'Erro desconhecido';

    const status = error.status || error.response?.status;

    switch (status) {
        case 400:
            return 'Requisição inválida. Verifique os dados informados.';
        case 401:
            return 'Não autorizado. Faça login novamente.';
        case 403:
            return 'Acesso negado. Você não tem permissão para esta ação.';
        case 404:
            return 'Recurso não encontrado.';
        case 409:
            return 'Conflito. O recurso já existe.';
        case 422:
            return 'Dados inválidos. Verifique as informações.';
        case 500:
            return 'Erro no servidor. Tente novamente mais tarde.';
        case 503:
            return 'Serviço temporariamente indisponível.';
        default:
            return error.message || 'Erro ao processar requisição.';
    }
};

/**
 * Tratador de erro genérico que registra e retorna mensagem amigável
 * @param {string} context - Contexto do erro
 * @param {Error} error - Objeto de erro
 * @returns {string} Mensagem de erro amigável
 */
export const handleError = (context, error) => {
    logError(context, error);
    return getErrorMessage(error);
};
