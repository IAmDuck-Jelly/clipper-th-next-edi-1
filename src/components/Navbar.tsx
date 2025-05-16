import React from 'react';
import Link from 'next/link';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/">
            CLIPPER
            <span className="reusable-text">reusable</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link href="/reusable" className="nav-link"># Reusable</Link>
          <Link href="/about" className="nav-link"># About Clipper</Link>
          <Link href="/lighters" className="nav-link"># Our Lighters</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 