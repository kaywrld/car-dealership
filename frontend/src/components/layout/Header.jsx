import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, PlusCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { dealer, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const goToServices = () => {
    navigate('/')
    setTimeout(() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .ae-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.35s ease, box-shadow 0.35s ease;
        }
        .ae-header.top {
          background: #0045a0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ae-header.scrolled {
          background: rgba(0, 52, 125, 0.97);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 32px rgba(0, 20, 70, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ae-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .ae-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          text-decoration: none;
          flex-shrink: 0;
          line-height: 1;
        }
        .ae-logo-wordmark {
          display: flex;
          align-items: baseline;
          line-height: 1;
        }
        .ae-logo-bee {
          font-family: 'Anton', Impact, sans-serif;
          font-size: 3.6rem;
          letter-spacing: 0.06em;
          color: #ffffff;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .ae-logo-dot {
          font-family: 'Anton', Impact, sans-serif;
          font-size: 3.6rem;
          color: #ffd04a;
          margin: 0 6px;
          line-height: 1;
        }
        .ae-logo-cars {
          font-family: 'Anton', Impact, sans-serif;
          font-size: 3.6rem;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.88);
          line-height: 1;
          transition: color 0.2s ease;
        }
        .ae-logo-tagline {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 500;
          font-style: italic;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
          padding-left: 48%;
          white-space: nowrap;
        }
        .ae-logo-tagline .accent {
          color: #ffd04a;
          font-weight: 700;
          font-style: italic;
        }
        .ae-logo:hover .ae-logo-bee     { color: #ffd04a; }
        .ae-logo:hover .ae-logo-cars    { color: #ffffff; }
        .ae-logo:hover .ae-logo-tagline { color: rgba(255,255,255,0.85); }

        /* ── Desktop Nav ── */
        .ae-nav {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
        @media (max-width: 767px) { .ae-nav { display: none; } }

        .ae-nav a {
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          padding: 0.55rem 1.2rem;
          border-radius: 8px;
          position: relative;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ae-nav a:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.12);
        }
        .ae-nav a.active {
          color: #ffffff;
          background: rgba(255,255,255,0.15);
        }
        .ae-nav a.active::after {
          content: '';
          position: absolute;
          bottom: 5px; left: 50%;
          transform: translateX(-50%);
          width: 20px; height: 3px;
          border-radius: 2px;
          background: #ffd04a;
        }

        .ae-nav-services {
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.55rem 1.2rem;
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ae-nav-services:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.12);
        }

        /* ── Desktop Actions ── */
        .ae-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        @media (max-width: 767px) { .ae-actions { display: none; } }

        .ae-btn-add {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #ffffff;
          text-decoration: none;
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          transition: all 0.22s ease;
        }
        .ae-btn-add:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.45);
        }

        .ae-btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.55rem 0.85rem;
          border-radius: 8px;
          letter-spacing: 0.04em;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ae-btn-logout:hover {
          color: #fca5a5;
          background: rgba(255,80,80,0.1);
        }

        .ae-btn-login {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #0045a0;
          text-decoration: none;
          padding: 0.6rem 1.5rem;
          border-radius: 11px;
          background: #ffffff;
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 14px rgba(0,0,0,0.2);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .ae-btn-login::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(0,69,160,0.07) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .ae-btn-login:hover::before { transform: translateX(100%); }
        .ae-btn-login:hover {
          background: #eef4ff;
          box-shadow: 0 4px 22px rgba(0,0,0,0.25);
          transform: translateY(-1px);
          color: #003070;
        }
        .ae-btn-login:active { transform: translateY(0) scale(0.98); }

        /* ── Mobile toggle ── */
        .ae-toggle {
          display: none;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 9px;
          padding: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
          line-height: 0;
        }
        .ae-toggle:hover { background: rgba(255,255,255,0.2); }
        @media (max-width: 767px) {
          .ae-toggle { display: flex; align-items: center; justify-content: center; }
        }

        /* ── Mobile Drawer ── */
        .ae-drawer {
          background: #003d8f;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1rem 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          box-shadow: 0 16px 40px rgba(0,20,60,0.5);
        }
        .ae-drawer-link {
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          transition: color 0.18s ease, background 0.18s ease;
        }
        .ae-drawer-link:hover,
        .ae-drawer-link.active {
          color: #ffffff;
          background: rgba(255,255,255,0.12);
        }
        .ae-drawer-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0.5rem 0;
        }
        .ae-btn-login-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0045a0;
          text-decoration: none;
          padding: 0.85rem 1rem;
          border-radius: 11px;
          background: #ffffff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          margin-top: 0.25rem;
          transition: background 0.18s ease;
        }
        .ae-btn-login-mobile:active { background: #e8f0fd; }
        .ae-btn-add-mobile {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.18s ease;
        }
        .ae-btn-add-mobile:active { background: rgba(255,255,255,0.2); }
        .ae-btn-logout-mobile {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255,180,180,0.85);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          text-align: left;
          transition: color 0.18s ease, background 0.18s ease;
        }
        .ae-btn-logout-mobile:active {
          color: #fca5a5;
          background: rgba(255,80,80,0.1);
        }

        @media (max-width: 480px) {
          .ae-logo-bee, .ae-logo-dot, .ae-logo-cars { font-size: 2.6rem; }
          .ae-inner { height: 84px; padding: 0 1.25rem; }
        }
      `}</style>

      <header className={`ae-header ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="ae-inner">

          {/* Logo */}
          <Link to="/" className="ae-logo">
            <div className="ae-logo-wordmark">
              <span className="ae-logo-bee">BEE</span>
              <span className="ae-logo-dot">·</span>
              <span className="ae-logo-cars">CARS</span>
            </div>
            <span className="ae-logo-tagline">
              premium <span className="accent">quality</span> cars
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="ae-nav">
            {[['/', 'Home', true], ['/about', 'About', false], ['/contact', 'Contact', false]].map(
              ([to, label, end]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {label}
                </NavLink>
              )
            )}
            <button className="ae-nav-services" onClick={goToServices}>
              Services
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="ae-actions">
            {dealer ? (
              <>
                <Link to="/add-car" className="ae-btn-add">
                  <PlusCircle size={15} /> Add Car
                </Link>
                <button onClick={handleLogout} className="ae-btn-logout">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ae-btn-login">
                Dealer Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="ae-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="ae-drawer">
            {[['/', 'Home', true], ['/about', 'About', false], ['/contact', 'Contact', false]].map(
              ([to, label, end]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `ae-drawer-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              )
            )}
            <button
              className="ae-drawer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              onClick={() => { setMenuOpen(false); goToServices() }}
            >
              Services
            </button>
            <div className="ae-drawer-divider" />
            {dealer ? (
              <>
                <Link to="/add-car" className="ae-btn-add-mobile" onClick={() => setMenuOpen(false)}>
                  <PlusCircle size={16} /> Add Car
                </Link>
                <button onClick={handleLogout} className="ae-btn-logout-mobile">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ae-btn-login-mobile" onClick={() => setMenuOpen(false)}>
                Dealer Login
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  )
}