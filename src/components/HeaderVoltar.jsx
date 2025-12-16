import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderVoltar() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4 hover:underline"
        >
            <ArrowLeft className="mr-2" size={18} />
            Voltar
        </button>
    );
}
