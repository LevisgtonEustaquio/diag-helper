import React, { useState } from "react";

const formatarCPF = (value) => {
  if (!value) return "";

  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

const cpfValido = (cpf) => {
  const apenasNumeros = cpf.replace(/\D/g, "");
  return apenasNumeros.length === 11;
};

export default function InputCPF({ value, onChange, label, name, required }) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const valorFormatado = formatarCPF(e.target.value);

    onChange({
      target: {
        name,
        value: valorFormatado
      }
    });
  };

  const invalido = touched && required && !cpfValido(value || "");

  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder="000.000.000-00"
        maxLength={14}
        inputMode="numeric"
        required={required}
        className={`border p-3 rounded-xl w-full bg-slate-50 focus:bg-white outline-none transition-all
          ${invalido
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
      />

      {invalido && (
        <span className="text-xs text-red-600 font-bold ml-1">
          CPF inválido
        </span>
      )}
    </div>
  );
};