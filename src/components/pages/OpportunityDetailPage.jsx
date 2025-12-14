import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";
import { fetchOpportunityById } from "../../services/mockApi";

const OpportunityDetailPage = ({ T, user, onLoginRequest }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState("");
  const intent = new URLSearchParams(location.search).get("intent");

  useEffect(() => {
    setLoading(true);
    fetchOpportunityById(id)
      .then((data) => {
        if (!data) {
          setError("Opportunité introuvable");
          setLoading(false);
          return;
        }
        setOpportunity(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger cette opportunité");
        setLoading(false);
      });
  }, [id]);

  const handleAction = (action) => {
    if (!user) {
      const params = new URLSearchParams(location.search);
      params.set("intent", action);
      const redirectTarget = `${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      onLoginRequest(redirectTarget);
      return;
    }
    setActionFeedback(`${action} déclenché. Nous vous recontactons vite.`);
  };

  useEffect(() => {
    if (user && intent && opportunity) {
      handleAction(intent);
      const params = new URLSearchParams(location.search);
      params.delete("intent");
      const cleaned = params.toString();
      navigate(`${location.pathname}${cleaned ? `?${cleaned}` : ""}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, intent, opportunity]);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4">
          <CardBase className="p-8 animate-pulse bg-slate-100 h-64" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4">
          <CardBase className="p-8 text-center">
            <p className="text-lg font-semibold text-red-700">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <SecondaryBtn onClick={() => navigate(-1)}>Retour</SecondaryBtn>
              <PrimaryBtn onClick={() => navigate('/')}>Retour à l'accueil</PrimaryBtn>
            </div>
          </CardBase>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4">
        <CardBase className="p-8">
          <p className="text-sm font-semibold text-orange-600">{opportunity.type}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{opportunity.name}</h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <p><span className="font-semibold">Sport :</span> {opportunity.sport}</p>
              <p><span className="font-semibold">Pays :</span> {opportunity.country}</p>
              {opportunity.continent && <p><span className="font-semibold">Continent :</span> {opportunity.continent}</p>}
              {opportunity.date && <p><span className="font-semibold">Date :</span> {opportunity.date}</p>}
            </div>
            <div>
              {opportunity.level && opportunity.level !== 'all' && <p><span className="font-semibold">Niveau :</span> {opportunity.level}</p>}
              {opportunity.gender && <p><span className="font-semibold">Genre :</span> {opportunity.gender}</p>}
              {opportunity.category && <p><span className="font-semibold">Catégorie :</span> {opportunity.category}</p>}
              {opportunity.ageGroup && opportunity.ageGroup !== 'all' && <p><span className="font-semibold">Âge :</span> {opportunity.ageGroup}</p>}
            </div>
          </div>

          {opportunity.description && (
            <p className="mt-6 text-slate-700 leading-relaxed">{opportunity.description}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryBtn onClick={() => handleAction('Contacter')}>Contacter</PrimaryBtn>
            <SecondaryBtn onClick={() => handleAction('Postuler')}>Postuler</SecondaryBtn>
            <SecondaryBtn onClick={() => handleAction('Sauvegarder')}>Sauvegarder</SecondaryBtn>
          </div>

          {actionFeedback && <p className="mt-4 text-sm text-green-700">{actionFeedback}</p>}
        </CardBase>
      </div>
    </section>
  );
};

export default OpportunityDetailPage;
