import React from "react";
import { PrimaryBtn } from "../ui/Buttons";

const DashboardPage = ({ T, user, navigateTo }) => (
  <section className="py-20 bg-slate-50">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">{T.dashboard_welcome}</h2>
      <p className="mt-4 text-slate-600">{user.email}</p>
      <div className="mt-12">
        <PrimaryBtn onClick={() => navigateTo('/propose')}>{T.dashboard_propose_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

export default DashboardPage;
