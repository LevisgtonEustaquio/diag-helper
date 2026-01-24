import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos (padrão: 300ms)
 * @returns {any} Valor debounced
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
