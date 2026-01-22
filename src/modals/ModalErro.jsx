import { MdError } from "react-icons/md";

export default function ModalErro({ open, onClose, titulo, mensagem }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <MdError size={48} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-800">{titulo || "Erro!"}</h2>
        <p className="text-slate-600 mb-8">{mensagem}</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-primary-500 text-slate-800 font-bold hover:bg-primary-700 hover:text-slate-200 transition-all shadow-lg shadow-slate-200 cursor-pointer">
          Fechar
        </button>
      </div>
    </div>
  );
}