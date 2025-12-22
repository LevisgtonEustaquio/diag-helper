import React from "react";

const BarraPesquisa = ({ pesquisa, setPesquisa }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="🔍 Pesquisar paciente por nome ou CPF"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        className="w-full md:w-4/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};

export default BarraPesquisa;