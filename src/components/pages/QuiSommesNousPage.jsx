import React from "react";
import CardBase from "../ui/CardBase";

const QuiSommesNousPage = ({ T }) => (
  <section id="about-us" className="py-20 bg-slate-50">
    <div className="mx-auto max-w-3xl px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.about_us_title}</h2>
        <p className="mt-4 text-lg text-slate-600">{T.about_us_subtitle}</p>
      </div>
      <CardBase className="mt-12 p-8">
        <div className="text-left space-y-4 text-slate-700">
          <p>{T.about_us_p1}</p>
          <p>{T.about_us_p2}</p>
        </div>
      </CardBase>
    </div>
  </section>
);

export default QuiSommesNousPage;
