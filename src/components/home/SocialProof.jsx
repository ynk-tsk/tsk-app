import React from "react";

const SocialProof = ({ T }) => (
  <div className="bg-white py-12">
    <div className="mx-auto max-w-7xl px-4">
      <h3 className="text-center text-sm font-semibold text-slate-600 tracking-wider uppercase">{T.social_proof_title}</h3>
      <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=LigueSport" alt="LigueSport" /></div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=FédéJeunes" alt="FédéJeunes" /></div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=NextGen+Events" alt="NextGen Events" /></div>
        <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=ProForma" alt="ProForma" /></div>
        <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=Athletico" alt="Athletico" /></div>
      </div>
    </div>
  </div>
);

export default SocialProof;
