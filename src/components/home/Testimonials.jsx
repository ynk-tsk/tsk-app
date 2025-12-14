import React from "react";
import CardBase from "../ui/CardBase";

const Testimonials = ({ T }) => (
  <section className="py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.testimonials_title}</h2>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">{T.testimonials_player_quote}</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_player_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">{T.testimonials_coach_quote}</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_coach_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">{T.testimonials_club_quote}</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_club_name}</p>
        </CardBase>
      </div>
    </div>
  </section>
);

export default Testimonials;
