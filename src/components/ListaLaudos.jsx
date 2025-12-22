import CardLaudo from "./CardLaudo";

export default function ListaLaudos({ laudos, onEdit, onDelete }) {
  return (
    <section className="w-full">
      {/* container central que NÃO afeta navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            items-start
          "
        >
          {laudos.map((laudo) => (
            <CardLaudo
              key={laudo.id}
              laudo={laudo}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
