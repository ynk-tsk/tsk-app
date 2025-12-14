import React, { useState } from "react";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";

const ProposeOpportunityPage = ({ T }) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.propose_title}</h2>
        <p className="mt-4 text-slate-600">{T.propose_subtitle}</p>

        {submitted ? (
          <CardBase className="mt-12 p-8 text-center">
            <p className="text-lg font-semibold text-green-600">{T.propose_success}</p>
          </CardBase>
        ) : (
          <CardBase className="mt-12 p-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.propose_name}</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
                  <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>{T.type_tournament}</option>
                    <option>{T.type_camp}</option>
                    <option>{T.type_academy}</option>
                    <option>{T.type_travel_team}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
                  <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>
              <div className="text-center">
                <PrimaryBtn type="submit">{T.propose_submit}</PrimaryBtn>
              </div>
            </form>
          </CardBase>
        )}
      </div>
    </section>
  );
};

export default ProposeOpportunityPage;
