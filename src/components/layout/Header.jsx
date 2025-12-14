import React, { useCallback, useEffect, useRef, useState } from "react";
import { PrimaryBtn } from "../ui/Buttons";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ T, lang, onLanguageChange, navigateTo, currentPath, user, onLogout, onFilterSelect }) => {
  const [opportunityDropdown, setOpportunityDropdown] = useState(false);
  const [personaDropdown, setPersonaDropdown] = useState(false);
  const opportunityRef = useRef(null);
  const personaRef = useRef(null);

  const handleScrollTo = useCallback((id) => {
    navigateTo('/');
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    setPersonaDropdown(false);
  }, [navigateTo]);

  const handleSearchAndFilter = useCallback((type) => {
    onFilterSelect(type);
    navigateTo('/');
    requestAnimationFrame(() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }));
    setOpportunityDropdown(false);
  }, [navigateTo, onFilterSelect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (opportunityRef.current && !opportunityRef.current.contains(event.target)) setOpportunityDropdown(false);
      if (personaRef.current && !personaRef.current.contains(event.target)) setPersonaDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavBtn = ({ page, children }) => (
    <button
      onClick={() => navigateTo(page)}
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
      aria-current={currentPath === page ? 'page' : undefined}
    >
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-slate-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt={T.alt_logo} className="h-10 w-10 rounded-lg cursor-pointer" onClick={() => navigateTo('/')} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/40x40/f97316/white?text=TSK'; }}/>
          <div className="font-semibold text-slate-800 cursor-pointer" onClick={() => navigateTo('/')}>TSK Sport</div>
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          <NavBtn page="/">{T.nav_home}</NavBtn>

          <div className="relative" ref={opportunityRef}>
            <button
              onClick={() => setOpportunityDropdown(!opportunityDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={opportunityDropdown}
              aria-controls="menu-opps"
            >
              {T.nav_opportunity}
              <svg className={`w-4 h-4 transition-transform ${opportunityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {opportunityDropdown && (
              <div id="menu-opps" role="menu" className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Tournoi')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_tournaments}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Camp')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_camps}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Académie')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_academies}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Travel Team')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_travel_teams}</button>
                </div>
              </div>
            )}
          </div>

          {currentPath === '/' && (
            <div className="relative" ref={personaRef}>
              <button
                onClick={() => setPersonaDropdown(!personaDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={personaDropdown}
                aria-controls="menu-persona"
              >
                {T.nav_for_who}
                <svg className={`w-4 h-4 transition-transform ${personaDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {personaDropdown && (
                <div id="menu-persona" role="menu" className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button role="menuitem" onClick={() => handleScrollTo('players')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_players}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('coaches')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_coaches}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('clubs')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_clubs}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('organizers')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_organizers}</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <NavBtn page="/about-us">{T.nav_about_us}</NavBtn>
          <NavBtn page="/contact">{T.nav_contact}</NavBtn>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavBtn page="/dashboard">{T.nav_dashboard}</NavBtn>
              <button onClick={onLogout} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">{T.nav_logout}</button>
            </>
          ) : (
            <>
              <NavBtn page="/auth">{T.nav_login}</NavBtn>
              <PrimaryBtn onClick={() => navigateTo('/auth')}>{T.nav_signup}</PrimaryBtn>
            </>
          )}
          <LanguageSwitcher lang={lang} onChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
};

export default Header;
