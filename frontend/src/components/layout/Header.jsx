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

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const goToServices = () => {
    setMenuOpen(false)
    navigate('/')
    setTimeout(() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }), 120)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ae-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.35s ease, box-shadow 0.35s ease;
          /* Prevent any overflow */
          overflow: visible;
          width: 100%;
          max-width: 100vw;
        }
        .ae-header.top {
          background: #0045a0;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .ae-header.scrolled {
          background: rgba(0, 52, 125, 0.97);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 32px rgba(0,20,70,0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* ── Inner container ── */
        .ae-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          /* Safe padding — never lets content touch screen edge */
          padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          /* Prevent inner content from overflowing */
          overflow: hidden;
        }

        /* ── Logo ── */
        .ae-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
          flex-shrink: 0;
          line-height: 1;
          /* Prevent logo from getting pushed off screen */
          min-width: 0;
        }
        .ae-logo-wordmark {
          display: flex;
          align-items: baseline;
          line-height: 1;
        }
        .ae-logo-bee {
          font-family: 'Anton', Impact, sans-serif;
          font-size: clamp(1.6rem, 5vw, 2.8rem);
          letter-spacing: 0.06em;
          color: #ffffff;
          line-height: 1;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .ae-logo-dot {
          font-family: 'Anton', Impact, sans-serif;
          font-size: clamp(1.6rem, 5vw, 2.8rem);
          color: #ffd04a;
          margin: 0 4px;
          line-height: 1;
          white-space: nowrap;
        }
        .ae-logo-cars {
          font-family: 'Anton', Impact, sans-serif;
          font-size: clamp(1.6rem, 5vw, 2.8rem);
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.88);
          line-height: 1;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .ae-logo-tagline {
          font-size: clamp(0.5rem, 1.5vw, 0.68rem);
          font-weight: 500;
          font-style: italic;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
          white-space: nowrap;
        }
        .ae-logo-tagline .accent {
          color: #ffd04a;
          font-weight: 700;
        }
        .ae-logo:hover .ae-logo-bee  { color: #ffd04a; }
        .ae-logo:hover .ae-logo-cars { color: #ffffff; }

        /* ── Desktop Nav — hidden below 900px ── */
        .ae-nav {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          justify-content: center;
        }
        @media (max-width: 899px) { .ae-nav { display: none; } }

        .ae-nav a, .ae-nav-services {
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          position: relative;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .ae-nav a:hover,
        .ae-nav-services:hover {
          color: #fff;
          background: rgba(255,255,255,0.12);
        }
        .ae-nav a.active {
          color: #fff;
          background: rgba(255,255,255,0.15);
        }
        .ae-nav a.active::after {
          content: '';
          position: absolute;
          bottom: 5px; left: 50%;
          transform: translateX(-50%);
          width: 18px; height: 3px;
          border-radius: 2px;
          background: #ffd04a;
        }
        .ae-nav-services {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        /* ── Desktop Actions — hidden below 900px ── */
        .ae-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 899px) { .ae-actions { display: none; } }

        .ae-btn-add {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em;
          color: #fff; text-decoration: none;
          padding: 0.5rem 1rem; border-radius: 10px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          transition: all 0.2s; white-space: nowrap;
        }
        .ae-btn-add:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.45); }

        .ae-btn-logout {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.6);
          background: transparent; border: none; cursor: pointer;
          padding: 0.5rem 0.8rem; border-radius: 8px;
          letter-spacing: 0.04em; transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .ae-btn-logout:hover { color: #fca5a5; background: rgba(255,80,80,0.1); }

        .ae-btn-login {
          display: flex; align-items: center;
          font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: #0045a0; text-decoration: none;
          padding: 0.55rem 1.3rem; border-radius: 10px;
          background: #ffffff; border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          transition: all 0.22s; white-space: nowrap;
        }
        .ae-btn-login:hover { background: #eef4ff; transform: translateY(-1px); color: #003070; }

        /* ── Mobile toggle — shown below 900px ── */
        .ae-toggle {
          display: none;
          /* Fixed size — never gets squeezed */
          width: 42px;
          height: 42px;
          min-width: 42px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 9px;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          /* Ensure it's always visible */
          position: relative;
          z-index: 2;
        }
        .ae-toggle:hover { background: rgba(255,255,255,0.2); }
        @media (max-width: 899px) {
          .ae-toggle { display: flex; }
        }

        /* ── Drawer overlay ── */
        .ae-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 998;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Mobile Drawer ── */
        .ae-drawer {
          position: fixed;
          top: 72px;
          left: 0; right: 0;
          z-index: 999;
          background: #002f70;
          border-top: 1px solid rgba(255,255,255,0.10);
          border-bottom: 1px solid rgba(255,255,255,0.10);
          padding: 12px max(16px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 16px 40px rgba(0,20,60,0.55);
          animation: drawerDown 0.25s cubic-bezier(0.22,1,0.36,1);
          /* Max height so it never covers entire screen */
          max-height: calc(100vh - 72px);
          overflow-y: auto;
        }
        @keyframes drawerDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ae-drawer-link {
          font-size: 1rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: rgba(255,255,255,0.75);
          text-decoration: none; padding: 14px 16px; border-radius: 10px;
          transition: color 0.18s, background 0.18s; display: block;
        }
        .ae-drawer-link:hover,
        .ae-drawer-link.active {
          color: #fff; background: rgba(255,255,255,0.12);
        }
        .ae-drawer-link-btn {
          font-size: 1rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: rgba(255,255,255,0.75);
          background: none; border: none; cursor: pointer;
          padding: 14px 16px; border-radius: 10px; width: 100%; text-align: left;
          transition: color 0.18s, background 0.18s;
        }
        .ae-drawer-link-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }

        .ae-drawer-divider { height: 1px; background: rgba(255,255,255,0.10); margin: 6px 0; }

        .ae-drawer-add {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.95rem; font-weight: 700;
          color: #fff; text-decoration: none;
          padding: 14px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.18s;
        }
        .ae-drawer-add:active { background: rgba(255,255,255,0.2); }

        .ae-drawer-logout {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.95rem; font-weight: 600;
          color: rgba(255,180,180,0.85);
          background: transparent; border: none; cursor: pointer;
          padding: 14px 16px; border-radius: 10px; width: 100%; text-align: left;
          transition: color 0.18s, background 0.18s;
        }
        .ae-drawer-logout:active { color: #fca5a5; background: rgba(255,80,80,0.1); }

        .ae-drawer-login {
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: #0045a0; text-decoration: none;
          padding: 14px 16px; border-radius: 11px;
          background: #ffffff; box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          margin-top: 4px; transition: background 0.18s;
        }
        .ae-drawer-login:active { background: #e8f0fd; }

        /* ── Tablet tweaks (600–899px) ── */
        @media (min-width: 600px) and (max-width: 899px) {
          .ae-inner { height: 76px; }
          .ae-drawer { top: 76px; max-height: calc(100vh - 76px); }
        }

        /* ── Small phones (below 380px) ── */
        @media (max-width: 380px) {
          .ae-inner { height: 64px; padding: 0 12px; gap: 8px; }
          .ae-drawer { top: 64px; max-height: calc(100vh - 64px); }
          .ae-toggle { width: 38px; height: 38px; min-width: 38px; }
        }
      `}</style>

      <header className={`ae-header ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="ae-inner">

          {/* Logo */}
          <Link to="/" className="ae-logo" onClick={() => setMenuOpen(false)}>
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
                  key={to} to={to} end={end}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {label}
                </NavLink>
              )
            )}
            <button className="ae-nav-services" onClick={goToServices}>Services</button>
          </nav>

          {/* Desktop Actions */}
          <div className="ae-actions">
            {dealer ? (
              <>
                <Link to="/add-car" className="ae-btn-add">
                  <PlusCircle size={14} /> Add Car
                </Link>
                <button onClick={handleLogout} className="ae-btn-logout">
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ae-btn-login">Dealer Login</Link>
            )}
          </div>

          {/* Mobile Toggle — always visible on mobile, always fits */}
          <button
            className="ae-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div className="ae-overlay" onClick={() => setMenuOpen(false)} />
        )}

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="ae-drawer">
            {[['/', 'Home', true], ['/about', 'About', false], ['/contact', 'Contact', false]].map(
              ([to, label, end]) => (
                <NavLink
                  key={to} to={to} end={end}
                  className={({ isActive }) => `ae-drawer-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              )
            )}
            <button className="ae-drawer-link-btn" onClick={goToServices}>
              Services
            </button>

            <div className="ae-drawer-divider" />

            {dealer ? (
              <>
                <Link to="/add-car" className="ae-drawer-add" onClick={() => setMenuOpen(false)}>
                  <PlusCircle size={16} /> Add Car
                </Link>
                <button onClick={handleLogout} className="ae-drawer-logout">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ae-drawer-login" onClick={() => setMenuOpen(false)}>
                Dealer Login
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  )
}