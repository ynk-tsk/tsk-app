import React from "react";
import CardBase from "../ui/CardBase";

const EmptyState = ({
  activeFilters,
  onResetAll,
  onRemoveLast,
  onBroadenDates,
  onRelaxSport,
  suggestions,
  onApplySuggestion,
}) => (
  <CardBase className="col-span-full p-6" role="status" aria-live="polite">
    <p className="text-lg font-semibold text-slate-800">Aucun résultat</p>
    <p className="mt-2 text-sm text-slate-600">Ajustez rapidement vos filtres pour relancer la recherche.</p>
    {activeFilters.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {activeFilters.map(({ key, label, onRemove }) => (
          <button
            key={key}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
            onClick={onRemove}
            type="button"
          >
            {label} <span aria-hidden>✕</span>
          </button>
        ))}
      </div>
    )}

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        className="text-sm font-semibold text-orange-600 hover:underline"
        onClick={onRemoveLast}
      >
        Retirer le dernier filtre
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-orange-600 hover:underline"
        onClick={onBroadenDates}
      >
        Élargir les dates
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-orange-600 hover:underline"
        onClick={onRelaxSport}
      >
        Sport : Tous
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-orange-600 hover:underline"
        onClick={onResetAll}
      >
        Réinitialiser tout
      </button>
    </div>

    {suggestions?.length > 0 && (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((suggestion, idx) => (
          <CardBase key={idx} className="p-4 flex flex-col gap-2">
            <p className="font-semibold text-slate-800">{suggestion.label}</p>
            <p className="text-xs text-slate-500">{suggestion.description}</p>
            <button
              type="button"
              className="text-sm font-semibold text-orange-600 hover:underline"
              onClick={() => onApplySuggestion(suggestion.filters)}
            >
              Appliquer
            </button>
          </CardBase>
        ))}
      </div>
    )}
  </CardBase>
);

export default EmptyState;
