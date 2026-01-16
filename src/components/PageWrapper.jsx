export default function PageWrapper({ title, children }) {
  return (
    /* mx-auto centraliza em telas gigantes, w-full garante 100% no mobile */
    <div className="w-full max-w-7xl mx-auto">

      {title && (
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 px-1">
          {title}
        </h1>
      )}

      <div className="
        /* Sombra e arredondamento */
        shadow-sm md:shadow-md rounded-xl 
        
        /* Cores: Ajustei para um tom mais claro para melhor leitura, 
           mas mantendo a sua paleta Slate */
        bg-linear-to-br from-slate-50 to-slate-200
        border border-slate-300
        
        /* PADDING RESPONSIVO: 
           p-4 no mobile (16px) 
           md:p-8 no desktop (32px) */
        p-4 md:p-8 
        
        /* Evita que elementos internos (como tabelas) quebrem o card */
        overflow-x-auto
      ">
        {children}
      </div>
    </div>
  );
}