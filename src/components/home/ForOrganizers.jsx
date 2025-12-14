import React from "react";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";

const ForOrganizers = ({ T }) => (
  <section id="organizers" className="py-20">
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900">{T.organizers_title}</h2>
          <p className="mt-4 max-w-xl mx-auto md:mx-0 text-slate-600">{T.organizers_subtitle}</p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <PrimaryBtn onClick={() => { alert('Redirection vers le portail organisateur'); }}>{T.organizers_standard_cta}</PrimaryBtn>
            <SecondaryBtn onClick={() => { document.getElementById('accompagnement')?.scrollIntoView({ behavior: 'smooth' }); }}>Services Premium</SecondaryBtn>
          </div>
        </div>
        <div className="relative h-80 rounded-xl overflow-hidden">
          <img src="/organizers-background.png" alt={T.alt_organizers_bg} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/800x600/f97316/white?text=Event'; }}/>
        </div>
      </div>
    </div>
  </section>
);

export default ForOrganizers;
