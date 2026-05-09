/**
 * AuthNavbar
 * Top navigation bar shown on Register/Login pages
 */

import { Link } from 'react-router-dom';

export default function AuthNavbar() {
  return (
    <nav className="nav-bar">
      <Link to="/dashboard" className="nav-logo">
        <div className="logo-icon" style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/listify.svg" alt="Listify" />
        </div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '26px' }}>
          Listify
        </span>
      </Link>
      <div className="nav-links">
        <a href="/about">About us</a>
        <a href="/contact">Contacts</a>
      </div>
    </nav>
  );
}
