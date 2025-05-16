'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/">
            <Image
              src="/images/clipper-logo.png"
              alt="Clipper"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/reusable" className="nav-link"># {t('nav.reusable' as const)}</Link>
          <Link href="/about" className="nav-link"># {t('nav.about' as const)}</Link>
          <Link href="/lighter" className="nav-link"># {t('nav.lighters' as const)}</Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 