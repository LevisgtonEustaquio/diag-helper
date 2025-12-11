import React from "react";

const MainLayout = ({ children, className = '' }) => {
    return (
        <main 
            className={`
                // --- Estilos de Estrutura ---
                max-w-7xl  // Largura Máxima
                mx-auto    // Centralização Horizontal
                
                // --- Estilos de Aparência e Espaçamento ---
                bg-red-600   // Fundo branco para os blocos de conteúdo
                shadow-xl  // Sombra suave para destacar o bloco
                rounded-lg // Bordas arredondadas
                
                // Padding interno (espaço entre o conteúdo e a borda branca)
                p-8        
                
                // Margem superior (para afastar do topo da tela)
                mt-12      
                
                // Garantir que a largura do bloco se ajuste (útil para Flexbox/Grid)
                w-full
                
                // Classes Adicionais (Permite customização)
                ${className} 
            `}
        >
            {children}
        </main>
    );
};

export default MainLayout;