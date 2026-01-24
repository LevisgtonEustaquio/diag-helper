import PropTypes from "prop-types";

export default function BotaoContato({ icon: IconComponent, label, onClick, variant }) {
    const styles = {
        solid: "bg-green-600 text-white hover:bg-green-700",
        outline: "border border-gray-300 hover:bg-gray-50",
    };

    return (
        <button
            className={`w-full p-3 rounded-xl flex items-center justify-center gap-3 transition-all ${styles[variant]}`}
            onClick={onClick}
        >
            {/* Renderiza o ícone como componente */}
            <IconComponent size={20} />
            {label}
        </button>
    );
}

BotaoContato.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['solid', 'outline']).isRequired,
};
