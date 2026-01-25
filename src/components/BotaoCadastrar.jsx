import React from "react";
import { MdAdd } from "react-icons/md";

const BotaoCadastrar = ({ onClick, label = " Cadastrar" }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
                 w-full md:w-auto flex items-center justify-center gap-2 transition"
    >
      <MdAdd size={20} />
      {label}
    </button>
  );
};

export default BotaoCadastrar;
