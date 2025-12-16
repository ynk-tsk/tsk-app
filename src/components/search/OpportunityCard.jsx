import React from "react";
import CardBase from "../ui/CardBase";

const OpportunityCard = ({ opportunity, onOpen, onToggleSave, isSaved }) => (
  <div className="text-left" role="article" aria-label={opportunity.name}>
    <CardBase className="p-6 transition hover:shadow-lg hover:-translate-y-1 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-xs font-semibold text-orange-600">{opportunity.type}</p>
          <button
            type="button"
            onClick={() => onOpen(opportunity)}
            className="mt-1 font-semibold text-slate-800 hover:underline"
          >
            {opportunity.name}
          </button>
          <p className="text-xs text-slate-500">
            {opportunity.country} • {opportunity.sport}
            {opportunity.category && opportunity.category !== "all" ? ` • ${opportunity.category}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {opportunity.level && opportunity.level !== "all" && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                opportunity.level === "Elite"
                  ? "bg-red-100 text-red-800"
                  : opportunity.level === "Competition"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {opportunity.level}
            </span>
          )}
          <button
            type="button"
            className={`text-xs font-semibold ${isSaved ? "text-green-700" : "text-orange-600"} underline-offset-2 hover:underline`}
            onClick={() => onToggleSave(opportunity)}
          >
            {isSaved ? "Enregistré" : "Sauvegarder"}
          </button>
        </div>
      </div>
      {opportunity.date && opportunity.date !== "2025-01-01" && (
        <p className="mt-4 text-sm text-slate-600">
          {new Date(opportunity.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </CardBase>
  </div>
);

export default OpportunityCard;
