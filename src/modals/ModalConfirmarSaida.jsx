// import { useNavigate } from "react-router-dom";
// import { createPortal } from "react-dom";

// export default function ModalConfirmarSaida({ aberto, onClose }) {
//   const navigate = useNavigate();

//   if (!aberto) return null;

  
//   return createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto">
      
     
//       <div 
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
//         onClick={onClose} 
//       />

      
//       <div className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all">
//         <p className="text-xl font-bold text-slate-900 mb-2">
//           Tem certeza que deseja sair?
//         </p>
//         <p className="text-slate-500 mb-6">
//           Sua sessão será encerrada e você precisará fazer login novamente.
//         </p>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 text-slate-600 font-medium bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
//           >
//             Cancelar
//           </button>

//           <button
//             onClick={() => {
//               localStorage.removeItem("usuario");
             
//               navigate("/");
//             }}
//             className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-colors cursor-pointer"
//           >
//             Sair
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext"; // 1. Importe o hook useAuth

export default function ModalConfirmarSaida({ aberto, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 2. Pegue a função de logout do contexto

  if (!aberto) return null;

  const handleSair = () => {
    logout();      // 3. Isso vai limpar o estado (setUsuario(null)) E o localStorage
    onClose();     // Fecha o modal
    navigate("/"); // Redireciona
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all">
        <p className="text-xl font-bold text-slate-900 mb-2">
          Tem certeza que deseja sair?
        </p>
        <p className="text-slate-500 mb-6">
          Sua sessão será encerrada e você precisará fazer login novamente.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSair} // 4. Use a nova função tratada
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}