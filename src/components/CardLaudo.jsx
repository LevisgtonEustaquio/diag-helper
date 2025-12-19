export default function CardLaudo({ laudo }) {
  return (
    <div className="bg-white border rounded-xl shadow p-5 flex flex-col gap-2">
      <span className="text-xs text-gray-500">{laudo.data}</span>

      <h3 className="font-bold">{laudo.tipo}</h3>

      <p className="text-sm">
        <strong>Médico:</strong> {laudo.medico}
      </p>

      <p className="text-sm">
        <strong>Paciente:</strong> {laudo.paciente}
      </p>

      <p className="text-sm">
        <strong>Resultado:</strong> {laudo.resultado}
      </p>

      <p className="text-xs text-gray-600 line-clamp-3">
        {laudo.observacoes || "Sem observações"}
      </p>

      <span className="text-xs text-gray-400">
        {laudo.imagens.length} imagem(ns)
      </span>
    </div>
  );
}
