import { CircleX } from 'lucide-react';

export default function AlertBoxFalha({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-3">Erro!</h2>
        <div className="flex flex-col gap-4 justify-center items-center">
          <CircleX size={64} className="text-red-600" />
          <p className="mb-4">Falha no processamento da análise!</p>
        </div>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
