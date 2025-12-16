import { Mail, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Suporte() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
                {/* Voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 mb-4 hover:underline"
                >
                    <ArrowLeft className="mr-2" size={18} />
                    Voltar
                </button>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Suporte e Recuperação de Senha
                </h1>

                <p className="text-gray-600 text-center mb-6">
                    Precisa de ajuda? Escolha uma das opções abaixo para falar
                    conosco.
                </p>

                <div className="space-y-4">
                    {/* WhatsApp */}
                    <button
                        className="w-full bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-all"
                        onClick={() =>
                            window.open("https://wa.me/5511999999999", "_blank")
                        }
                    >
                        <MessageCircle size={20} />
                        Suporte via WhatsApp
                    </button>

                    {/* Telefone */}
                    <button
                        className="w-full border border-gray-300 p-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                        onClick={() =>
                            (window.location.href = "tel:+5511999999999")
                        }
                    >
                        <Phone size={20} />
                        Ligar para o suporte
                    </button>

                    {/* Email */}
                    <button
                        className="w-full border border-gray-300 p-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                        onClick={() =>
                            (window.location.href = "mailto:suporte@clinic.com")
                        }
                    >
                        <Mail size={20} />
                        Enviar e-mail ao suporte
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Caso seu problema seja sobre **recuperar senha**, informe
                    seu e-mail ou CPF.
                </p>
            </div>
        </div>
    );
}
