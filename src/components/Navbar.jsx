import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/arcade', label: 'Arcade' },
    { path: '/course', label: 'Core Structures' },
    { path: '/pattern-recognition', label: 'Pattern Training' },
    { path: '/notes-quiz', label: 'Notes Quiz' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-wrapper">
            <img src="/logo.jpg" alt="QuantNinja" className="navbar-logo" />
          </div>
          <span className="navbar-title">QuantNinja</span>
        </Link>

        <button
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="navbar-actions">
            <ThemeToggle />
            <Link to="/course" className="btn btn-primary btn-shine navbar-cta" onClick={() => setIsOpen(false)}>
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
