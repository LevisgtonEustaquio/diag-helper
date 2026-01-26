import React from "react";
import { MdClose } from "react-icons/md";

export default function ModalForm({ isOpen, onClose, title, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    /* h-screen e w-screen garantem que ocupe a janela toda, independente do conteúdo pai */
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center">
      
      {/* Overlay: Forçamos o inset-0 e usamos h-full w-full */}
      <div 
        className="absolute inset-0 w-full h-full bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
        style={{ height: '100vh', width: '100vw' }} // Reforço via Style se o Tailwind falhar
      />

      {/* Conteúdo do Modal */}
      <div className="relative z-[10000] w-full max-w-4xl mx-4 bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 text-primary-600">
            {Icon && <Icon size={24} />}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Área interna com Scroll - h-full garante que ocupe o espaço disponível */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}