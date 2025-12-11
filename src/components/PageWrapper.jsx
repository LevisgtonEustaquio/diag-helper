import React from "react";


const PageWrapper = ({ children }) => {
    return (
        // Define a altura mínima da tela (h-screen) e aplica o fundo
        <div className="min-h-screen bg-red-600">
            {children}
        </div>
    );
};

export default PageWrapper;