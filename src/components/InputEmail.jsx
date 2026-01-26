import React, { useState } from "react";

const emailValido = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function InputEmail({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = "email@dominio.com",
  compareWith,
  compareLabel = "Os e-mails não coincidem"
}) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
  onChange({
    target: {
      name,
      value: e.target.value
    }
  });
};

const emailNormalizado = value?.toLowerCase() || "";
const compareNormalizado = compareWith?.toLowerCase() || "";

  const emailInvalido =
  touched &&
  required &&
  (!emailNormalizado || !emailValido(emailNormalizado));

  const emailsDiferentes =
  touched &&
  compareWith !== undefined &&
  emailNormalizado &&
  compareNormalizado &&
  emailNormalizado !== compareNormalizado;

  const invalido = emailInvalido || emailsDiferentes;

  const mensagemErro = () => {
    if (emailInvalido) return "E-mail inválido";
    if (emailsDiferentes) return compareLabel;
    return "";
  };

  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>

      <input
        type="email"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
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