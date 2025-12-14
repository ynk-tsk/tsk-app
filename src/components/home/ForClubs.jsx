import React from "react";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";

const ForClubs = ({ T }) => (
  <section id="clubs" className="py-20 bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-2 items-center">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{T.clubs_title}</h2>
        <p className="mt-4 text-slate-600">{T.clubs_subtitle}</p>
        <div className="mt-6 space-y-3 text-slate-700">
          <p><strong>{T.clubs_s1_title} — </strong>{T.clubs_s1_text}</p>
          <p><strong>{T.clubs_s2_title} — </strong>{T.clubs_s2_text}</p>
        </div>
        <div className="mt-8">
          <PrimaryBtn onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
            {T.clubs_cta}
          </PrimaryBtn>
        </div>
      </div>
      <CardBase className="p-8">
        <p className="text-slate-600">
          {T.clubs_tip}
        </p>
      </CardBase>
    </div>
  </section>
);

export default ForClubs;
