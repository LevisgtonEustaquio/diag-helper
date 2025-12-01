// import { LogOut } from "lucide-react";
// import ModalConfirmarSaida from "./modals/ModalConfirmarSaida";

// export default function Logout(){

//     const [logout, setLogout] = useState(false);


//     return(

//         <div>

//         <button
//             onClick={() => setLogout(true)}
//             className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//           >
//             <LogOut size={20} /> Sair
//           </button>

//           <ModalConfirmarSaida />
//         </div>
//     );
// }

import { useState } from "react";
import ModalConfirmarSaida from "../modals/ModalConfirmarSaida";

export default function Logout() {
  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbrirModal(true)}
        className="flex justify-center items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
      >
        Sair
      </button>

      <ModalConfirmarSaida
        aberto={abrirModal}
        onClose={() => setAbrirModal(false)}
      />
    </>
  );
}

