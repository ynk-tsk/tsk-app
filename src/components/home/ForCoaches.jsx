import React from "react";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";

const ForCoaches = ({ T }) => (
  <section id="coaches" className="py-20">
    <div className="mx-auto max-w-7xl px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">{T.coaches_title}</h2>
      <p className="mt-4 max-w-2xl mx-auto text-slate-600">{T.coaches_subtitle}</p>
      <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
        <CardBase className="p-8">
          <h3 className="text-xl font-semibold text-slate-800">{T.coaches_s1_title}</h3>
          <p className="mt-2 text-slate-600">{T.coaches_s1_text}</p>
        </CardBase>
        <CardBase className="p-8">
          <h3 className="text-xl font-semibold text-slate-800">{T.coaches_s2_title}</h3>
          <p className="mt-2 text-slate-600">{T.coaches_s2_text}</p>
        </CardBase>
      </div>
      <div className="mt-8">
        <PrimaryBtn onClick={() => { document.getElementById('rankings')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.coaches_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

export default ForCoaches;
