import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";

const AuthPage = ({ T, onLogin, navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectTo = location.state?.redirectTo;
    const intent = location.state?.intent;
    onLogin({ email: e.target.email.value }, redirectTo, redirectTo ? { state: { resumedIntent: intent } } : undefined);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-md px-4">
        <CardBase className="p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900">
            {isLogin ? T.auth_login_title : T.auth_signup_title}
          </h2>
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
        </CardBase>
      </div>
    </section>
  );
};

export default AuthPage;
