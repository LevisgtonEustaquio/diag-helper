import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LogOut } from "lucide-react";

export default function Dashboard({ expanded }) {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  // 🔵 Buscar usuários quando abrir a página
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const gerarDataHora = () => {
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${data} ${hora}`;
  };

  // 🔵 CADASTRAR (POST no json-server)
  const cadastrar = async (e) => {
    e.preventDefault();

    const novoUsuario = {
      ...form,
      criadoEm: gerarDataHora(),
    };

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioSalvo = await res.json();

      setUsuarios((prev) => [...prev, usuarioSalvo]);

      setForm({
        nome: "",
        cpf: "",
        cargo: "",
        status: "Ativo",
      });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  // 🔵 REMOVER (DELETE)
  const remover = async (id) => {
    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "DELETE",
      });

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const total = usuarios.length;
  const ativos = usuarios.filter((u) => u.status === "Ativo").length;
  const novosHoje = usuarios.filter((u) =>
    u.criadoEm?.startsWith(new Date().toLocaleDateString("pt-BR"))
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">

      <Navbar expanded={expanded} />

      {/* MAIN */}
      <main
        className={`
          flex-1 p-6 transition-all duration-300 
          ${expanded ? "md:ml-64" : "md:ml-20"}
        `}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card title="Total de Usuários" value={total} />
          <Card title="Ativos" value={ativos} />
          <Card title="Cadastros Hoje" value={novosHoje} />
        </div>

        {/* FORM */}
        <section className="bg-white p-4 shadow rounded mb-6">
          <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>

          <form
            onSubmit={cadastrar}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Input
              label="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <Input
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            />

            <Input
              label="Cargo"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            />

            <select
              className="border p-2 rounded w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700 w-full sm:w-auto"
            >
              Salvar
            </button>
          </form>
        </section>

        {/* TABELA */}
        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-bold mb-4">Usuários Cadastrados</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <Th>Nome</Th>
                  <Th>CPF</Th>
                  <Th>Cargo</Th>
                  <Th>Status</Th>
                  <Th>Criado em</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b">
                    <Td>{u.nome}</Td>
                    <Td>{u.cpf}</Td>
                    <Td>{u.cargo}</Td>
                    <Td>{u.status}</Td>
                    <Td>{u.criadoEm}</Td>
                    <Td>
                      <button
                        onClick={() => remover(u.id)}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL SAIR */}
      {/* {confirmarSaida && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-semibold mb-4">
              Tem certeza que deseja sair?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarSaida(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("usuario");
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

/* COMPONENTES AUXILIARES */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 shadow rounded text-center">
      <p className="text-gray-600">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <input
      type="text"
      placeholder={label}
      className="border p-2 rounded w-full"
      {...props}
      required
    />
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}

//

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { LogOut } from "lucide-react";

// export default function Dashboard({ expanded }) {
//   const navigate = useNavigate();

//   const [usuarios, setUsuarios] = useState([]);

//   const [form, setForm] = useState({
//     nome: "",
//     cpf: "",
//     cargo: "",
//     status: "Ativo",
//   });

//   // Modal de confirmação
//   const [confirmarSaida, setConfirmarSaida] = useState(false);

//   const gerarDataHora = () => {
//     const agora = new Date();
//     const data = agora.toLocaleDateString("pt-BR");
//     const hora = agora.toLocaleTimeString("pt-BR", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     return `${data} ${hora}`;
//   };

//   const cadastrar = (e) => {
//     e.preventDefault();

//     const novoUsuario = {
//       id: Date.now(),
//       ...form,
//       criadoEm: gerarDataHora(),
//     };

//     setUsuarios((prev) => [...prev, novoUsuario]);

//     setForm({
//       nome: "",
//       cpf: "",
//       cargo: "",
//       status: "Ativo",
//     });
//   };

//   const remover = (id) => {
//     setUsuarios((prev) => prev.filter((u) => u.id !== id));
//   };

//   const total = usuarios.length;
//   const ativos = usuarios.filter((u) => u.status === "Ativo").length;
//   const novosHoje = usuarios.filter((u) =>
//     u.criadoEm.startsWith(new Date().toLocaleDateString("pt-BR"))
//   ).length;

//   return (
//     <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">

//       <Navbar expanded={expanded} />

//       {/* MAIN */}
//       <main
//         className={`
//           flex-1 p-6 transition-all duration-300 
//           ${expanded ? "md:ml-64" : "md:ml-20"}
//         `}
//       >
//         {/* Cabeçalho */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Dashboard</h1>

//           <button
//             onClick={() => setConfirmarSaida(true)}
//             className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//           >
//             <LogOut size={20} /> Sair
//           </button>
//         </div>

//         {/* CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <Card title="Total de Usuários" value={total} />
//           <Card title="Ativos" value={ativos} />
//           <Card title="Cadastros Hoje" value={novosHoje} />
//         </div>

//         {/* FORM */}
//         <section className="bg-white p-4 shadow rounded mb-6">
//           <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>

//           <form
//             onSubmit={cadastrar}
//             className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//           >
//             <Input
//               label="Nome"
//               value={form.nome}
//               onChange={(e) => setForm({ ...form, nome: e.target.value })}
//             />

//             <Input
//               label="CPF"
//               value={form.cpf}
//               onChange={(e) => setForm({ ...form, cpf: e.target.value })}
//             />

//             <Input
//               label="Cargo"
//               value={form.cargo}
//               onChange={(e) => setForm({ ...form, cargo: e.target.value })}
//             />

//             <select
//               className="border p-2 rounded w-full"
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//             >
//               <option value="Ativo">Ativo</option>
//               <option value="Inativo">Inativo</option>
//             </select>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700 w-full sm:w-auto"
//             >
//               Salvar
//             </button>
//           </form>
//         </section>

//         {/* TABELA */}
//         <section className="bg-white p-4 shadow rounded">
//           <h2 className="text-lg font-bold mb-4">Usuários Cadastrados</h2>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <Th>Nome</Th>
//                   <Th>CPF</Th>
//                   <Th>Cargo</Th>
//                   <Th>Status</Th>
//                   <Th>Criado em</Th>
//                   <Th>Ações</Th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {usuarios.map((u) => (
//                   <tr key={u.id} className="border-b">
//                     <Td>{u.nome}</Td>
//                     <Td>{u.cpf}</Td>
//                     <Td>{u.cargo}</Td>
//                     <Td>{u.status}</Td>
//                     <Td>{u.criadoEm}</Td>
//                     <Td>
//                       <button
//                         onClick={() => remover(u.id)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Excluir
//                       </button>
//                     </Td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* MODAL SAIR */}
//       {confirmarSaida && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <p className="text-lg font-semibold mb-4">
//               Tem certeza que deseja sair?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmarSaida(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancelar
//               </button>

//               <button
//                 onClick={() => {
//                   localStorage.removeItem("usuario");
//                   navigate("/");
//                 }}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Sair
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* COMPONENTES AUXILIARES */
// function Card({ title, value }) {
//   return (
//     <div className="bg-white p-4 shadow rounded text-center">
//       <p className="text-gray-600">{title}</p>
//       <p className="text-3xl font-bold">{value}</p>
//     </div>
//   );
// }

// function Input({ label, ...props }) {
//   return (
//     <input
//       type="text"
//       placeholder={label}
//       className="border p-2 rounded w-full"
//       {...props}
//       required
//     />
//   );
// }

// function Th({ children }) {
//   return <th className="px-3 py-2 font-semibold">{children}</th>;
// }

// function Td({ children }) {
//   return <td className="px-3 py-2">{children}</td>;
// }
