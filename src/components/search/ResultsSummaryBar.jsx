import React from "react";

const ResultsSummaryBar = ({ count, activeFilters, onRemoveFilter, onReset }) => {
  if (!count && activeFilters.length === 0) return null;
  return (
    <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border border-slate-200 rounded-lg p-3 flex flex-wrap gap-3 items-center">
      <span className="text-sm font-semibold text-slate-800">{count} opportunités</span>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(({ key, label }) => (
          <button
            key={key}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
            onClick={() => onRemoveFilter(key)}
            type="button"
          >
            {label} <span aria-hidden>✕</span>
          </button>
        ))}
      </div>
      <div className="ml-auto">
        <button
          type="button"
          className="text-sm font-semibold text-orange-600 hover:underline"
          onClick={onReset}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ResultsSummaryBar;
