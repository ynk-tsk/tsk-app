import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";
import { useUserData } from "../../hooks/useUserData";

const AuthPage = ({ T }) => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { login, migrationSummary, clearMigrationSummary } = useUserData();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (migrationSummary) {
      const oppCount = migrationSummary.opportunitiesTransferred || 0;
      const searchCount = migrationSummary.searchesTransferred || 0;
      setFeedback(`${oppCount} opportunités et ${searchCount} recherches ont été transférées dans votre compte.`);
      clearMigrationSummary();
    }
  }, [migrationSummary, clearMigrationSummary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectTo = location.state?.redirectTo;
    const intent = location.state?.intent;
    login(e.target.email.value);
    const target = redirectTo || "/dashboard";
    const navigateState = redirectTo ? { state: { resumedIntent: intent } } : undefined;
    setFeedback("Compte prêt : vos données locales resteront disponibles et synchronisées.");
    navigate(target, navigateState);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-md px-4">
        <CardBase className="p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900">
            {isLogin ? T.auth_login_title : T.auth_signup_title}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {T.auth_value_first_hint}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.auth_email}</label>
              <input type="email" name="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.auth_password}</label>
              <input type="password" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <PrimaryBtn type="submit" className="w-full">{isLogin ? T.auth_login_btn : T.auth_signup_btn}</PrimaryBtn>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-orange-600 hover:underline">
              {isLogin ? `${T.auth_no_account} ${T.nav_signup}` : `${T.auth_has_account} ${T.nav_login}`}
            </button>
          </div>
          {feedback && (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800" role="status" aria-live="polite">
              {feedback}
            </div>
          )}
        </CardBase>
      </div>
    </section>
  );
};

export default AuthPage;
