import React from "react";
import CardBase from "../ui/CardBase";
import { PrimaryBtn } from "../ui/Buttons";

const ContactPage = ({ T }) => (
  <section id="contact" className="py-20 bg-slate-50">
    <div className="mx-auto max-w-2xl px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">{T.contact_title}</h2>
      <p className="mt-4 text-slate-600">{T.contact_subtitle}</p>

      <CardBase className="mt-12 p-8 text-left">
        <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" data-netlify-recaptcha="true" className="space-y-6">
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700">{T.contact_subject}</label>
            <select name="subject" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
              <option>{T.contact_reason_player}</option>
              <option>{T.contact_reason_coach}</option>
              <option>{T.contact_reason_club}</option>
              <option>{T.contact_reason_organizer}</option>
              <option>{T.contact_reason_accompagnement}</option>
              <option>{T.contact_reason_other}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.contact_name}</label>
              <input type="text" name="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.contact_email}</label>
              <input type="email" name="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{T.contact_message}</label>
            <textarea name="message" rows="4" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
          </div>
          <div data-netlify-recaptcha="true"></div>
          <div className="text-center">
            <PrimaryBtn type="submit">{T.contact_send}</PrimaryBtn>
          </div>
        </form>
      </CardBase>
    </div>
  </section>
);

export default ContactPage;
