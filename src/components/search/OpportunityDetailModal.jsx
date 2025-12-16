import React from "react";
import CardBase from "../ui/CardBase";

const OpportunityDetailModal = ({ opportunity, onClose, onSaveToggle, isSaved }) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-w-2xl w-full">
        <CardBase className="p-6 bg-white">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-xs font-semibold text-orange-600">{opportunity.type}</p>
              <h3 className="text-2xl font-bold text-slate-900">{opportunity.name}</h3>
              <p className="text-sm text-slate-600">
                {opportunity.country} • {opportunity.sport}
              </p>
              {opportunity.date && opportunity.date !== "2025-01-01" && (
                <p className="mt-2 text-sm text-slate-600">
                  {new Date(opportunity.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Niveau : {opportunity.level}</p>
            <p>Genre : {opportunity.gender}</p>
            <p>Catégorie : {opportunity.category}</p>
            <p>Âge : {opportunity.ageGroup}</p>
            <p>Continent : {opportunity.continent}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-semibold"
              onClick={() => onSaveToggle(opportunity)}
            >
              {isSaved ? "Retirer" : "Sauvegarder"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </CardBase>
      </div>
    </div>
  );
};

export default OpportunityDetailModal;
