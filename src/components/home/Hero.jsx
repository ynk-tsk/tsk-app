import React from "react";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";

const Hero = ({ T }) => (
  <section className="relative text-center py-20 md:py-32 overflow-hidden">
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
        {T.h1_top} <span className="text-orange-500">{T.h1_highlight}</span>
      </h1>
      <p className="mt-6 text-lg text-slate-200 font-medium">{T.h1_sub}</p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <PrimaryBtn onClick={() => { document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.cta_primary}</PrimaryBtn>
        <SecondaryBtn onClick={() => { document.getElementById('organizers')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.cta_secondary}</SecondaryBtn>
      </div>
    </div>
  </section>
);

export default Hero;
