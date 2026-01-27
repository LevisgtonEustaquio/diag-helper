import React, { useState } from "react";

export default function InputPassword({
  label,
  value,
  onChange,
  required = false,
  minLength = 6,
  compareWith,
  compareLabel = "As senhas não coincidem"
}) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    // não força lowercase em senha
    const valor = e.target.value.trimStart();

    onChange({
      target: {
        value: valor
      }
    });
  };

  const senhaCurta = value && value.length < minLength;
  const senhasDiferentes =
    compareWith !== undefined &&
    value &&
    compareWith &&
    value !== compareWith;

  const invalido =
    touched &&
    (
      (required && senhaCurta) ||
      senhasDiferentes
    );

  const mensagemErro = () => {
    if (senhaCurta) {
      return `Senha deve ter no mínimo ${minLength} caracteres`;
    }
    if (senhasDiferentes) {
      return compareLabel;
    }
    return "";
  };

  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        required={required}
        className={`border p-3 rounded-xl w-full bg-slate-50 focus:bg-white outline-none transition-all
          ${invalido
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
      />

      {invalido && (
        <span className="text-xs text-red-600 font-bold ml-1">
          {mensagemErro()}
        </span>
      )}
    </div>
  );
};