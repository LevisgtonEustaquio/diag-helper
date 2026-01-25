import React from "react";
import { Search } from "lucide-react"; 

const BarraPesquisa = ({ pesquisa, setPesquisa, placeholder }) => {
  return (
    <div className="relative w-full group">

      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
        <Search size={18} />
      </div>

    <input
        type="text"
        placeholder={placeholder || "Pesquisar paciente por nome ou CPF..."}
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        className="
          w-full
          pl-10           /* Espaço para o ícone à esquerda */
          pr-4 
          py-2.5 
          bg-white 
          border 
          border-slate-200 
          rounded-xl 
          shadow-sm 
          text-slate-700
          placeholder:text-slate-400
          focus:ring-2 
          focus:ring-blue-500/20 
          focus:border-blue-500
          outline-none 
          transition-all
        "
      />
    </div>
  );
};

export default BarraPesquisa;