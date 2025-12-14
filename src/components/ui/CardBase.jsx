import React from "react";

const CardBase = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>
    {children}
  </div>
);

export default CardBase;
