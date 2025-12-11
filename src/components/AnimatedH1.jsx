import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Componente que renderiza um H1 com uma animação de revelação.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo do H1 (o texto).
 */
const AnimatedH1 = ({ children }) => {
    // 1. Ref para o container do H1
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        // Garantindo que o GSAP está pronto e que o elemento existe
        if (!rootRef.current) return;

        // 2. Criação da Timeline
        const tl = gsap.timeline({ paused: true });
       
        const chars = rootRef.current.querySelectorAll('.char'); 

        // 3. Aplicação da Animação
        if (chars.length) {
            tl.fromTo(
                chars,
                {
                    // Estado inicial (FROM)
                    skewX: -30,
                    filter: "blur(10px) brightness(0%)",
                    willChange: "filter, transform",
                },
                {
                    // Estado final (TO)
                    skewX: 0,
                    filter: "blur(0px) brightness(100%)",
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "none",
                }
            );
        }

        // 4. Executa a animação
        tl.play();

        // Limpeza (opcional, mas recomendado)
        return () => {
            tl.kill();
        };
    }, [children]); // Re-executa se o texto mudar

    return (
        <h1 ref={rootRef} style={{ overflow: 'hidden' }}>
            {/* Mapeia o texto e envolve cada caractere em um span com a classe 'char' */}
            {String(children).split('').map((char, index) => (
                <span
                    key={index}
                    className="char text-5xl leading-normal"
                    // Estilo para garantir que os spans fiquem em linha
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {char}
                </span>
            ))}
        </h1>
    );
};

export default AnimatedH1;