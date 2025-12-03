// import { CircleCheckBig } from "lucide-react";

// export default function ModalProcessando({ open, onClose }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl shadow-lg text-center">
//         <h2 className="text-xl font-bold mb-3">Concluído!</h2>
//         <div className="flex flex-col gap-4 justify-center items-center">
//           <CircleCheckBig size={64} />
//           <p className="mb-4">Seu laudo foi enviado com sucesso!</p>
//         </div>
//         <button
//           onClick={onClose}
//           className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg cursor-pointer"
//         >
//           Fechar
//         </button>
//       </div>
//     </div>
//   );
// }


import SpinnerLucide from "./SpinnerLucide";

export default function ModalProcessando({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center gap-4">

        {/* Ícone animado */}

        <h2 className="text-xl font-bold">Processando Análise...</h2>

        <SpinnerLucide size={40} />
        
        <p className="text-gray-700">Aguarde um momento.</p>

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
