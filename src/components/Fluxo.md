// FLUXO RESUMIDO (Etapas)
//- Cadastro paciente →
//- Solicitação exame →
//- Realização exame + upload imagens →
//- Notificação laudista →
//- Laudo gerado e assinado →
//- Integração no prontuário
//------------------------------

// Detalhamento do fluxo
// 1. Cadastro do Paciente
// - Recepcionista cadastra o paciente (nome, idade, contatos), nome do médico solicitante gera o ID único.
// 2. Encaminhamento para o Exame
// O paciente leva a ficha (requisição) ao setor de exames e o médico confere com a requisição criada no sistema.
// 3. Realização do Exame
// - Técnico realiza o exame, captura as imagens e faz o upload no sistema vinculando ao ID do paciente.
// 4. Notificação ao Laudista e geração do Laudo
// - Sistema notifica o laudista sobre o novo exame pendente via sistema.
// - O médico laudista acessa o sistema, visualiza as imagens, submete a IA para laudo prévio, para poder aceitar/ complementar ou declinar, salvando o laudo final no protuário e assina digitalmente.
// 5. Entrega do Laudo e impressão das imagens
// - O sistema notifica a recepção para que o paciente possa retirar o laudo ou acessá-lo digitalmente.
// - A recepção imprime as imagens, se necessário, e entrega ao paciente junto com o laudo.