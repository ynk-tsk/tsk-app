import React, { useEffect, useState } from "react";
import CardBase from "../ui/CardBase";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";
import {
  getAnalyticsSnapshot,
  resetAnalytics,
  startSession,
} from "../../services/analytics";

const MetricRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
  </div>
);

const DebugPage = () => {
  const [snapshot, setSnapshot] = useState(getAnalyticsSnapshot());

  useEffect(() => {
    startSession();
    setSnapshot(getAnalyticsSnapshot());
  }, []);

  const refresh = () => {
    setSnapshot(getAnalyticsSnapshot());
  };

  const handleReset = () => {
    resetAnalytics();
    setSnapshot(getAnalyticsSnapshot());
  };

  const { currentSession, last7Days } = snapshot;

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Debug</p>
            <h1 className="text-2xl font-bold text-slate-900">UX telemetry (local only)</h1>
          </div>
          <div className="flex gap-2">
            <SecondaryBtn onClick={refresh}>Actualiser</SecondaryBtn>
            <PrimaryBtn onClick={handleReset}>Réinitialiser</PrimaryBtn>
          </div>
        </div>

        <CardBase className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Session en cours</p>
              <p className="text-sm text-slate-600">Démarrée le {new Date(currentSession.start).toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetricRow label="Interactions de recherche" value={currentSession.searches} />
            <MetricRow label="Recherches sauvegardées" value={currentSession.saves} />
            <MetricRow label="Clics alertes" value={currentSession.alertsClicks} />
            <MetricRow label="Résultats à zéro" value={currentSession.zeroResultEvents} />
            <MetricRow label="Clics opportunités" value={currentSession.opportunityClicks} />
          </div>
        </CardBase>

        <CardBase className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">7 derniers jours</p>
              <p className="text-sm text-slate-600">
                Fenêtre depuis le {new Date(last7Days.since).toLocaleDateString()} ({last7Days.sessionsCount} sessions)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetricRow label="Interactions de recherche" value={last7Days.searches} />
            <MetricRow label="Recherches sauvegardées" value={last7Days.saves} />
            <MetricRow label="Clics alertes" value={last7Days.alertsClicks} />
            <MetricRow label="Résultats à zéro" value={last7Days.zeroResultEvents} />
            <MetricRow label="Clics opportunités" value={last7Days.opportunityClicks} />
          </div>
        </CardBase>
      </div>
    </section>
  );
};

export default DebugPage;
