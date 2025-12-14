import React from "react";
import { PrimaryBtn } from "../ui/Buttons";

const Hero = ({ T }) => (
  <section className="relative text-center py-20 md:py-28 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="/hero-background.png"
        alt={T.alt_hero}
        className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/1920x1080/1e293b/f8fafc?text=Focus'; }}
      />
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative mx-auto max-w-4xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
        {T.search_title || 'Trouver une opportunité sportive'}
      </h1>
      <p className="mt-6 text-lg text-slate-200 font-medium">
        {T.search_subtitle || 'Filtre les sports, pays et formats pour accéder rapidement aux opportunités adaptées.'}
      </p>
      <div className="mt-8 flex justify-center">
        <PrimaryBtn onClick={() => { document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}>
          {T.cta_primary || 'Lancer une recherche'}
        </PrimaryBtn>
      </div>
    </div>
  </section>
);

export default Hero;
