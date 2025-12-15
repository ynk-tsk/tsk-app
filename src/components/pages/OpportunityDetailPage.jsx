import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";
import { fetchOpportunityById } from "../../services/mockApi";
import { locales } from "../../i18n/i18n";
import { useUserData } from "../../hooks/useUserData";

const skeletonBlock = "bg-slate-200 animate-pulse rounded";

const OpportunityDetailPage = ({ T, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { user, toggleSavedOpportunity, isOpportunitySaved, recordRecentlyViewed, continuityPrompt, setContinuityPrompt, data } = useUserData();

  const formatter = useMemo(() => locales[lang] || locales.fr, [lang]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setStatusMessage(T.loading || "Chargement en cours");
    fetchOpportunityById(id)
      .then((data) => {
        if (!isMounted) return;
        setOpportunity(data);
        setStatusMessage("Opportunité chargée");
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Impossible de charger cette opportunité pour le moment.");
        setStatusMessage("Erreur lors du chargement");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id, T.loading]);

  useEffect(() => {
    if (location.state?.resumedIntent && opportunity && user) {
      setActionMessage(`Action ${location.state.resumedIntent} confirmée sur ${opportunity.name}.`);
    }
  }, [location.state, opportunity, user]);

  useEffect(() => {
    if (opportunity) {
      recordRecentlyViewed(opportunity);
    }
  }, [opportunity, recordRecentlyViewed]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from, {
        replace: false,
        state: {
          scrollPosition: location.state.scrollPosition,
          filters: location.state.filters,
          view: location.state.view,
          from: "detail",
        },
      });
      return;
    }
    navigate(-1);
  };

  const handleAction = (intent) => {
    if (!opportunity) return;
    if (intent === "sauvegarder") {
      const saved = toggleSavedOpportunity(opportunity);
      setActionMessage(saved ? "Opportunité sauvegardée sur cet appareil." : "Opportunité retirée de vos favoris.");
      if (!user) setContinuityPrompt("saved");
      return;
    }
    setActionMessage(`Action ${intent} notée pour ${opportunity.name}. Vous pourrez la finaliser plus tard.`);
    if (!user) setContinuityPrompt("continuity");
  };

  const importantMessage = actionMessage || error || statusMessage;

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="sr-only" aria-live="polite">{importantMessage}</div>
        <button
          onClick={handleBack}
          className="mb-6 text-sm text-orange-600 hover:underline focus-visible:outline focus-visible:outline-orange-600"
          aria-label="Retour à la liste"
        >
          ← {T.nav_home}
        </button>

        <CardBase className="p-6">
          {loading ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className={`${skeletonBlock} h-6 w-1/3`} />
              <div className={`${skeletonBlock} h-10 w-3/4`} />
              <div className={`${skeletonBlock} h-4 w-1/2`} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className={`${skeletonBlock} h-16 w-full`} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-slate-700">
              <p className="text-red-600 mb-3">{error}</p>
              <PrimaryBtn onClick={() => navigate(0)} className="min-h-[44px]">
                Réessayer
              </PrimaryBtn>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-orange-600">{opportunity?.type}</p>
                <h1 className="text-2xl font-bold text-slate-900">{opportunity?.name}</h1>
                <p className="text-sm text-slate-600">
                  {opportunity?.country} • {opportunity?.sport}
                  {opportunity?.category !== "all" ? ` • ${opportunity?.category}` : ""}
                </p>
                {opportunity?.date && opportunity?.date !== "2025-01-01" && (
                  <p className="text-sm text-slate-500">
                    {new Date(opportunity.date).toLocaleDateString(formatter, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <PrimaryBtn
                  onClick={() => handleAction("contact")}
                  className="min-h-[44px] text-center"
                  disabled={!opportunity}
                >
                  Contacter
                </PrimaryBtn>
                <SecondaryBtn
                  onClick={() => handleAction("postuler")}
                  className="min-h-[44px] text-center"
                  disabled={!opportunity}
                >
                  Postuler
                </SecondaryBtn>
                <button
                  onClick={() => handleAction("sauvegarder")}
                  className={`min-h-[44px] rounded-lg border px-5 py-3 text-sm font-semibold shadow-md hover:bg-slate-50 disabled:opacity-50 ${
                    isOpportunitySaved(Number(id)) ? 'border-green-300 text-green-800 bg-green-50' : 'border-slate-200 text-slate-700'
                  }`}
                  disabled={!opportunity}
                >
                  {isOpportunitySaved(Number(id)) ? 'Enregistré' : 'Sauvegarder'}
                </button>
              </div>

              {actionMessage && (
                <div
                  className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                  role="status"
                  aria-live="polite"
                >
                  {actionMessage}
                </div>
              )}
              {!user && (data.savedOpportunities.length > 0 || continuityPrompt) && (
                <CardBase className="mt-6 border border-orange-200 bg-orange-50">
                  <p className="font-semibold text-orange-800">{T.continuity_cta_title}</p>
                  <p className="text-sm text-orange-700 mt-1">{`Créez un compte pour conserver ${data.savedOpportunities.length} opportunités et ${data.savedSearches.length} recherches sur tous vos appareils.`}</p>
                  <PrimaryBtn
                    className="mt-3"
                    onClick={() => navigate('/auth', { state: { redirectTo: location.pathname, intent: 'continuity' } })}
                  >
                    {T.cta_keep_everywhere}
                  </PrimaryBtn>
                </CardBase>
              )}
            </>
          )}
        </CardBase>
      </div>
    </section>
  );
};

export default OpportunityDetailPage;
