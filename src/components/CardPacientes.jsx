import React from "react";

const CardPaciente = ({ paciente, onEdit, onDelete, onAddExame }) => {
  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white px-4 sm:px-px-6 lg:px-8 py-6 rounded-lg border items-start">
      <p><span className="font-bold">Nome:</span> {paciente.nome}</p>
      <p><span className="font-bold">Nascimento:</span> {paciente.dataNascimento}</p>
      <p><span className="font-bold">Telefone:</span> {paciente.telefone}</p>
      <p><span className="font-bold">CPF:</span> {paciente.cpf}</p>

      <div className="flex flex-col gap-4 md:col-span-2">
        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => onEdit(paciente)} 
            className="text-blue-600 text-base font-semibold hover:scale-125 transition"
          >
            Editar
          </button>

          <button 
            onClick={() => onDelete(paciente.id)} 
            className="text-red-600 text-base font-semibold hover:scale-125 transition"
          >
            Excluir
          </button>

          <button 
            onClick={() => onAddExame(paciente)} 
            className="text-green-700 text-base font-semibold hover:scale-125 transition"
            title="Adicionar exame"
          >
            Adiciona Exame
          </button>
        </div>

        {/* LISTA DE EXAMES DO PACIENTE */}
        <div className="mt-2">
          <p className="font-bold text-xs">Exames:</p>
          {paciente.exames && paciente.exames.length > 0 ? (
            <ul className="list-disc list-inside text-xs text-gray-600">
              {paciente.exames.map((e, idx) => (
                <li key={idx}>
                  {e.tipo} - {e.data}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-xs">Nenhum exame</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPaciente;