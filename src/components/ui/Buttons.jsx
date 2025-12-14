import React from "react";

export const PrimaryBtn = ({ children, onClick, type = "button", className = "", ...rest }) => (
  <button
    type={type}
    onClick={onClick}
    className={`cursor-pointer inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-50 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const SecondaryBtn = ({ children, onClick, className = "", ...rest }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-300 hover:bg-slate-50 ${className}`}
    {...rest}
  >
    {children}
  </button>
);
