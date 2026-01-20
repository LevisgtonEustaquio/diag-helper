import PropTypes from "prop-types";
import { memo } from "react";

const TituloPagina = memo(function TituloPagina({ titulo, descricao }) {
    return (
        <>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                {titulo}
            </h1>
            {descricao && (
                <p className="text-gray-600 text-center mb-6">{descricao}</p>
            )}
        </>
    );
});

TituloPagina.propTypes = {
    titulo: PropTypes.string.isRequired,
    descricao: PropTypes.string,
};

export default TituloPagina;
