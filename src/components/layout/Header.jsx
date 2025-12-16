import React, { useCallback, useEffect, useRef, useState } from "react";
import { PrimaryBtn } from "../ui/Buttons";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ T, lang, onLanguageChange, navigateTo, user, onLogout, onFilterSelect }) => {
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const moreRef = useRef(null);

  const closeAll = useCallback(() => {
    setMoreDropdown(false);
    setMobileMenuOpen(false);
  }, []);

  const handleScrollTo = useCallback((id) => {
    navigateTo('/');
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    closeAll();
  }, [closeAll, navigateTo]);

  const handleSearchAndFilter = useCallback((type) => {
    onFilterSelect(type);
    navigateTo('/');
    requestAnimationFrame(() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }));
    closeAll();
  }, [closeAll, navigateTo, onFilterSelect]);

  const handleFindOpportunity = useCallback(() => {
    navigateTo('/');
    requestAnimationFrame(() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }));
    closeAll();
  }, [closeAll, navigateTo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DropdownLink = ({ onClick, children }) => (
    <button
      role="menuitem"
      onClick={onClick}
      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
    >
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-slate-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt={T.alt_logo}
            className="h-10 w-10 rounded-lg cursor-pointer"
            onClick={() => { navigateTo('/'); closeAll(); }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/40x40/f97316/white?text=TSK'; }}
          />
          <div className="font-semibold text-slate-800 cursor-pointer" onClick={() => { navigateTo('/'); closeAll(); }}>TSK Sport</div>
        </div>

        <nav className="hidden md:flex items-center gap-3" aria-label="Navigation principale">
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreDropdown(!moreDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={moreDropdown}
              aria-controls="menu-more"
            >
              {T.nav_more}
              <svg className={`w-4 h-4 transition-transform ${moreDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {moreDropdown && (
              <div id="menu-more" role="menu" className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-semibold uppercase text-slate-500">{T.nav_opportunity}</div>
                  <DropdownLink onClick={() => handleSearchAndFilter('Tournoi')}>{T.nav_tournaments}</DropdownLink>
                  <DropdownLink onClick={() => handleSearchAndFilter('Camp')}>{T.nav_camps}</DropdownLink>
                  <DropdownLink onClick={() => handleSearchAndFilter('Académie')}>{T.nav_academies}</DropdownLink>
                  <DropdownLink onClick={() => handleSearchAndFilter('Travel Team')}>{T.nav_travel_teams}</DropdownLink>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase text-slate-500">{T.nav_more}</div>
                  <DropdownLink onClick={() => handleScrollTo('my-stuff')}>
                    {T.nav_my_items || 'Mes éléments'}
                  </DropdownLink>
                  <DropdownLink onClick={() => handleScrollTo('saved-opportunities')}>
                    {T.nav_saved_opportunities || 'Opportunités sauvegardées'}
                  </DropdownLink>
                  <DropdownLink onClick={() => handleScrollTo('players')}>{T.nav_players}</DropdownLink>
                  <DropdownLink onClick={() => handleScrollTo('coaches')}>{T.nav_coaches}</DropdownLink>
                  <DropdownLink onClick={() => handleScrollTo('clubs')}>{T.nav_clubs}</DropdownLink>
                  <DropdownLink onClick={() => handleScrollTo('organizers')}>{T.nav_organizers}</DropdownLink>
                  <DropdownLink onClick={() => { navigateTo('/about-us'); closeAll(); }}>{T.nav_about_us}</DropdownLink>
                  <DropdownLink onClick={() => { navigateTo('/contact'); closeAll(); }}>{T.nav_contact}</DropdownLink>
                  {user ? (
                    <>
                      <DropdownLink onClick={() => { navigateTo('/dashboard'); closeAll(); }}>{T.nav_dashboard}</DropdownLink>
                      <DropdownLink onClick={() => { onLogout(); closeAll(); }}>{T.nav_logout}</DropdownLink>
                    </>
                  ) : (
                    <>
                      <DropdownLink onClick={() => { navigateTo('/auth'); closeAll(); }}>{T.nav_login}</DropdownLink>
                      <DropdownLink onClick={() => { navigateTo('/auth'); closeAll(); }}>{T.nav_signup}</DropdownLink>
                    </>
                  )}
                  <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase text-slate-500">{T.nav_language || 'Langue'}</div>
                  <div className="px-4 pb-3">
                    <LanguageSwitcher lang={lang} onChange={(value) => { onLanguageChange(value); closeAll(); }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <PrimaryBtn onClick={handleFindOpportunity} className="shadow-lg ring-2 ring-orange-200">{T.nav_opportunity}</PrimaryBtn>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <PrimaryBtn onClick={handleFindOpportunity} className="text-sm">
            {T.nav_opportunity}
          </PrimaryBtn>
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMoreDropdown(false); }}
            aria-label="Toggle navigation"
            className="p-2 rounded-md hover:bg-slate-100 text-slate-700 border border-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95">
          <div className="px-4 py-3 space-y-3">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-2">{T.nav_opportunity}</div>
              <div className="rounded-md border border-slate-200">
                <DropdownLink onClick={() => handleSearchAndFilter('Tournoi')}>{T.nav_tournaments}</DropdownLink>
                <DropdownLink onClick={() => handleSearchAndFilter('Camp')}>{T.nav_camps}</DropdownLink>
                <DropdownLink onClick={() => handleSearchAndFilter('Académie')}>{T.nav_academies}</DropdownLink>
                <DropdownLink onClick={() => handleSearchAndFilter('Travel Team')}>{T.nav_travel_teams}</DropdownLink>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-600 mb-2">{T.nav_more}</div>
              <div className="rounded-md border border-slate-200">
                <DropdownLink onClick={() => handleScrollTo('my-stuff')}>
                  {T.nav_my_items || 'Mes éléments'}
                </DropdownLink>
                <DropdownLink onClick={() => handleScrollTo('saved-opportunities')}>
                  {T.nav_saved_opportunities || 'Opportunités sauvegardées'}
                </DropdownLink>
                <DropdownLink onClick={() => handleScrollTo('players')}>{T.nav_players}</DropdownLink>
                <DropdownLink onClick={() => handleScrollTo('coaches')}>{T.nav_coaches}</DropdownLink>
                <DropdownLink onClick={() => handleScrollTo('clubs')}>{T.nav_clubs}</DropdownLink>
                <DropdownLink onClick={() => handleScrollTo('organizers')}>{T.nav_organizers}</DropdownLink>
                <DropdownLink onClick={() => { navigateTo('/about-us'); closeAll(); }}>{T.nav_about_us}</DropdownLink>
                <DropdownLink onClick={() => { navigateTo('/contact'); closeAll(); }}>{T.nav_contact}</DropdownLink>
                {user ? (
                  <>
                    <DropdownLink onClick={() => { navigateTo('/dashboard'); closeAll(); }}>{T.nav_dashboard}</DropdownLink>
                    <DropdownLink onClick={() => { onLogout(); closeAll(); }}>{T.nav_logout}</DropdownLink>
                  </>
                ) : (
                  <>
                    <DropdownLink onClick={() => { navigateTo('/auth'); closeAll(); }}>{T.nav_login}</DropdownLink>
                    <DropdownLink onClick={() => { navigateTo('/auth'); closeAll(); }}>{T.nav_signup}</DropdownLink>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <LanguageSwitcher lang={lang} onChange={(value) => { onLanguageChange(value); closeAll(); }} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
