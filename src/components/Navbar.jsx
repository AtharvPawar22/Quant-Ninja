import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import { isAuthenticated, getUser, signOut, getUserInitial } from '../services/authService';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Check auth state on mount and when location changes
  useEffect(() => {
    const updateUser = () => setUser(getUser());

    updateUser();

    // Listen for storage events (emitted by authService for cross-instance and same-tab sync)
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/arcade', label: 'Arcade' },
    { path: '/course', label: 'Core Structures' },
    { path: '/pattern-recognition', label: 'Pattern Training' },
    { path: '/notes-quiz', label: 'Notes Quiz' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    setUser(null);
    setShowUserMenu(false);
  };

  const handleAuthSuccess = (newUser) => {
    setUser(newUser);
  };

  return (
    <>
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
              {/* User Profile Icon */}
              <div className="user-profile-wrapper" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      className="user-profile-btn signed-in"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="User menu"
                    >
                      <span className="user-initial">{user.initial}</span>
                    </button>

                    {showUserMenu && (
                      <div className="user-dropdown">
                        <div className="user-dropdown-header">
                          <span className="user-email">{user.email}</span>
                        </div>
                        <div className="user-dropdown-divider"></div>
                        
                        <div className="user-dropdown-row">
                            <span className="dropdown-label">Appearance</span>
                            <ThemeToggle />
                        </div>

                        <div className="user-dropdown-divider"></div>
                        
                        <button className="user-dropdown-item" onClick={handleSignOut}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16,17 21,12 16,7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="user-profile-btn"
                    onClick={() => setShowAuthModal(true)}
                    aria-label="Sign in"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>
                )}
              </div>

              <Link to="/course" className="btn btn-primary btn-shine navbar-cta" onClick={() => setIsOpen(false)}>
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
