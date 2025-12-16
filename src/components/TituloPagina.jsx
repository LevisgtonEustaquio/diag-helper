export default function TituloPagina({ titulo, descricao }) {
    return (
        <>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                {titulo}
            </h1>
            <p className="text-gray-600 text-center mb-6">{descricao}</p>
        </>
    );
}
