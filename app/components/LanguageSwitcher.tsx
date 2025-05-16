'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = (newLang: 'en' | 'th') => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => language !== 'en' && toggleLanguage('en')}
      >
        EN
      </button>
      <span className="lang-separator">|</span>
      <button 
        className={`lang-btn ${language === 'th' ? 'active' : ''}`}
        onClick={() => language !== 'th' && toggleLanguage('th')}
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher; 