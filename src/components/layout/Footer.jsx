import React from "react";

const Footer = ({ T }) => (
  <footer className="border-t border-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500">
      <div>{T.footer_text}</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-slate-800">Mentions légales</a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-slate-800">Haut de page</a>
      </div>
    </div>
  </footer>
);

export default Footer;
