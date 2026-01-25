export default function BotaoContato({ icon: Icon, label, onClick, variant }) {
    const styles = {
        solid: "bg-green-600 text-white hover:bg-green-700",
        outline: "border border-gray-300 hover:bg-gray-50",
    };

    return (
        <button
            className={`w-full p-3 rounded-xl flex items-center justify-center gap-3 transition-all ${styles[variant]}`}
            onClick={onClick}
        >
            <Icon size={20} />
            {label}
        </button>
    );
}
