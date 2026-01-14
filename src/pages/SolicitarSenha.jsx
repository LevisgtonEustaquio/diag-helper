import { useEffect, useState } from "react";

export default function SolicitarSenha() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [crm, setCrm] = useState("");
  const [cpf, setCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    const dados =
      JSON.parse(localStorage.getItem("solicitacoesSenha")) || [];
    setSolicitacoes(dados);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !email || !perfil) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }
    if (perfil === "medico" && !crm) {
      setMensagem("Informe o CRM do médico.");
      return;
    }
    if (perfil === "recepcionista" && !cpf) {
      setMensagem("Informe o CPF da recepcionista.");
      return;
    }

    const solicitacoesSalvas =
      JSON.parse(localStorage.getItem("solicitacoesSenha")) || [];

    const jaExiste = solicitacoesSalvas.some(
      (s) => s.email === email && s.status === "pendente"
    );

    if (jaExiste) {
      setMensagem("Já existe uma solicitação pendente para este e-mail.");
      return;
    }

    const novaSolicitacao = {
      id: Date.now(),
      tipo: "senha",
      nome,
      email,
      perfil,
      crm: perfil === "medico" ? crm : null,
      cpf: perfil === "recepcionista" ? cpf : null,
      status: "pendente",
      data: new Date().toLocaleString(),
    };

    const atualizadas = [...solicitacoesSalvas, novaSolicitacao];
    localStorage.setItem("solicitacoesSenha", JSON.stringify(atualizadas));

    setSolicitacoes(atualizadas);
    setMensagem("Solicitação enviada para o administrador.");

    setNome("");
    setEmail("");
    setPerfil("");
    setCrm("");
    setCpf("");
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white p-8 rounded-xl shadow max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Solicitar redefinição de senha</h1>
        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium">Nome completo</label>
          <input
            className="w-full border rounded-lg p-2 mb-4"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <label className="text-sm font-medium">E-mail</label>
          <input
            className="w-full border rounded-lg p-2 mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-sm font-medium">Perfil</label>
          <select
            className="w-full border rounded-lg p-2 mb-4"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="medico">Médico</option>
            <option value="recepcionista">Recepcionista</option>
          </select>

          {perfil === "medico" && (
            <>
              <label className="text-sm font-medium">CRM</label>
              <input
                className="w-full border rounded-lg p-2 mb-4"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
              />
            </>
          )}

          {perfil === "recepcionista" && (
            <>
              <label className="text-sm font-medium">CPF</label>
              <input
                className="w-full border rounded-lg p-2 mb-4"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </>
          )}

          {mensagem && <p className="text-blue-600 text-sm mb-4">{mensagem}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar solicitação
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Histórico de solicitações</h2>
        {solicitacoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma solicitação realizada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Perfil</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.nome}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2 capitalize">{s.perfil}</td>
                  <td className="p-2">
                    <span
                      className={
                        s.status === "pendente"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-2">{s.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
