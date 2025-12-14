import React from "react";
import { PrimaryBtn } from "../ui/Buttons";

const Accompagnement = ({ T }) => (
  <section id="accompagnement" className="py-20 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0">
      <img src="/concierge-background.png" className="w-full h-full object-cover opacity-20" alt={T.alt_accompagnement_bg} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/1920x1080/1e293b/f8fafc?text=Strategy'; }}/>
    </div>
    <div className="relative mx-auto max-w-7xl px-4 text-center">
      <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{T.accompagnement_section_title}</h2>
      <p className="mt-4 max-w-3xl mx-auto text-slate-300">{T.accompagnement_section_subtitle}</p>
      <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_players_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_players_text}</p>
        </div>
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_coaches_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_coaches_text}</p>
        </div>
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_organizers_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_organizers_text}</p>
        </div>
      </div>
      <div className="mt-12">
        <PrimaryBtn onClick={() => { alert('Redirection vers le formulaire de contact Accompagnement'); }}>{T.accompagnement_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

export default Accompagnement;
