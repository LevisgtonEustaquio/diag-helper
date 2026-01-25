import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import ModalConfirmarSaida from "../modals/ModalConfirmarSaida";

export default function Logout({ expanded }) {
  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbrirModal(true)}
        className={`
          flex flex-col items-center cursor-pointer group transition-all
          ${expanded ? "items-start" : "items-center"}
        `}
      >
        <FiLogOut 
          size={24} 
          className="text-red-500 transition-transform duration-200 group-hover:scale-110" 
        />
        
        <p className={`
          text-red-500 text-xs font-semibold transition-all duration-300 mt-0.5
          ${expanded ? "opacity-100" : "md:opacity-0 md:h-0 md:overflow-hidden"}
        `}>
          Sair
        </p>
      </button>

      <ModalConfirmarSaida
        aberto={abrirModal}
        onClose={() => setAbrirModal(false)}
      />
    </>
  );
}