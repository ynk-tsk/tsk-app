import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import i18n from "./i18n/i18n";
import HomePage from "./components/home/HomePage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import QuiSommesNousPage from "./components/pages/QuiSommesNousPage";
import ContactPage from "./components/pages/ContactPage";
import AuthPage from "./components/pages/AuthPage";
import DashboardPage from "./components/pages/DashboardPage";
import ProposeOpportunityPage from "./components/pages/ProposeOpportunityPage";

export default function App() {
  const { i18n: i18nextInstance } = useTranslation();
  const lang = i18nextInstance.language || 'fr';
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [initialSearchFilter, setInitialSearchFilter] = useState(null);
  const T = useMemo(() => i18nextInstance.getResourceBundle(lang, 'translation') || {}, [i18nextInstance, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (location.pathname === '/' && !initialSearchFilter) return;
    window.scrollTo(0, 0);
  }, [lang, location.pathname, initialSearchFilter]);

  const handleLanguageChange = (newLang) => { i18n.changeLanguage(newLang); };
  const handleLogin = (userData) => { setUser(userData); navigate('/dashboard'); };
  const handleLogout = () => { setUser(null); navigate('/'); };
  const handleFilterSelect = (filter) => {
    setInitialSearchFilter(filter);
    if (location.pathname !== '/') navigate('/');
    requestAnimationFrame(() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }));
  };
  const clearInitialFilter = () => { setInitialSearchFilter(null); };
  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        T={T}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        navigateTo={navigateTo}
        currentPath={location.pathname}
        user={user}
        onLogout={handleLogout}
        onFilterSelect={handleFilterSelect}
      />
      <main>
        <Routes>
          <Route path="/" element={<HomePage T={T} initialFilter={initialSearchFilter} clearInitialFilter={clearInitialFilter} lang={lang} />} />
          <Route path="/about-us" element={<QuiSommesNousPage T={T} />} />
          <Route path="/contact" element={<ContactPage T={T} />} />
          <Route path="/auth" element={<AuthPage T={T} onLogin={handleLogin} navigateTo={navigateTo} />} />
          <Route path="/dashboard" element={user ? <DashboardPage T={T} user={user} navigateTo={navigateTo} /> : <Navigate to="/" replace />} />
          <Route path="/propose" element={user ? <ProposeOpportunityPage T={T} /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer T={T} />
    </div>
  );
}
