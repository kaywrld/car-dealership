import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function TwitterIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const socials = [
  { label: 'Facebook',  href: 'https://facebook.com/beecars',         Icon: FacebookIcon,  color: '#1877F2' },
  { label: 'WhatsApp',  href: 'https://wa.me/263771234567',           Icon: WhatsAppIcon,  color: '#25D366' },
  { label: 'Instagram', href: 'https://instagram.com/beecars',        Icon: InstagramIcon, color: '#E1306C' },
  { label: 'Twitter',   href: 'https://twitter.com/beecars',          Icon: TwitterIcon,   color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/beecars', Icon: LinkedinIcon, color: '#0A66C2' },
]

export default function Footer() {
  return (
    <>
      <style>{`
        .bc-footer {
          background: #0045a0;
          border-top: 1px solid rgba(255,255,255,0.12);
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
          display: block;
        }

        .bc-footer::before {
          content: '';
          position: absolute;
          top: -100px; left: -120px;
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .bc-footer::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -100px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(0,20,70,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        .bc-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2.5rem 1.75rem 0;
          position: relative;
          z-index: 1;
        }

        .bc-footer-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 900px) {
          .bc-footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
          .bc-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 540px) {
          .bc-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
        }

        .bc-footer-logo {
          display: flex;
          align-items: baseline;
          gap: 0;
          text-decoration: none;
          margin-bottom: 1.1rem;
          width: fit-content;
          line-height: 1;
        }
        .bc-logo-bee {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 0.12em;
          color: #ffffff;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .bc-logo-dot {
          font-family: var(--font-display);
          font-size: 2rem;
          color: #ffd04a;
          margin: 0 2px;
          line-height: 1;
        }
        .bc-logo-cars {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.85);
          line-height: 1;
          transition: color 0.2s ease;
        }
        .bc-footer-logo:hover .bc-logo-bee  { color: #ffd04a; }
        .bc-footer-logo:hover .bc-logo-cars { color: #ffffff; }

        .bc-footer-rule {
          width: 48px;
          height: 2px;
          border-radius: 2px;
          background: rgba(255,255,255,0.35);
          margin-bottom: 1.25rem;
        }

        .bc-footer-tagline {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          max-width: 300px;
          margin: 0;
        }

        .bc-footer-heading {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1.25rem;
          position: relative;
          padding-bottom: 0.75rem;
        }
        .bc-footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 24px; height: 2px;
          border-radius: 2px;
          background: rgba(255,255,255,0.45);
        }

        .bc-footer-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .bc-footer-links li a {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          padding: 0.42rem 0.6rem;
          border-radius: 7px;
          transition: color 0.2s ease, background 0.2s ease, padding-left 0.2s ease;
        }
        .bc-footer-links li a:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.1);
          padding-left: 0.9rem;
        }
        .bc-link-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .bc-footer-links li a:hover .bc-link-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }

        .bc-footer-contact {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .bc-footer-contact li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }
        .bc-contact-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .bc-footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.2) 70%, transparent);
          margin: 2.5rem 0 0;
          position: relative;
          z-index: 1;
        }

        .bc-footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 540px) {
          .bc-footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
        }

        .bc-footer-copy {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.02em;
          margin: 0;
        }
        .bc-footer-copy span { color: rgba(255,255,255,0.5); }

        .bc-footer-badge {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }

        /* Kill any default body/html spacing below footer */
        body, html {
          margin: 0;
          padding: 0;
        }
      `}</style>

      <footer className="bc-footer">
        <div className="bc-footer-inner">
          <div className="bc-footer-grid">

            {/* Brand */}
            <div className="bc-footer-brand">
              <Link to="/" className="bc-footer-logo">
                <span className="bc-logo-bee">BEE</span>
                <span className="bc-logo-dot">·</span>
                <span className="bc-logo-cars">CARS</span>
              </Link>
              <div className="bc-footer-rule" />
              <p className="bc-footer-tagline">
                Premium new and pre-owned vehicles and exclusive hire cars. Every car verified, every client treated like royalty.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem', flexWrap: 'wrap' }}>
                {socials.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    style={{
                      width: 34, height: 34,
                      borderRadius: 9,
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.70)',
                      textDecoration: 'none',
                      transition: 'background 0.2s, color 0.2s, border-color 0.2s, transform 0.18s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = color
                      e.currentTarget.style.borderColor = color
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.70)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="bc-footer-heading">Quick Links</h4>
              <ul className="bc-footer-links">
                {[['/', 'Home'], ['/inventory', 'Inventory'], ['/hire', 'Hire a Car'], ['/about', 'About Us'], ['/contact', 'Contact']].map(
                  ([to, label]) => (
                    <li key={to}>
                      <Link to={to}>
                        {label}
                        <ArrowUpRight size={12} className="bc-link-arrow" />
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="bc-footer-heading">Contact</h4>
              <ul className="bc-footer-contact">
                <li>
                  <div className="bc-contact-icon"><Phone size={13} color="rgba(255,255,255,0.8)" /></div>
                  +263 772 529 318
                </li>
                <li>
                  <div className="bc-contact-icon"><Mail size={13} color="rgba(255,255,255,0.8)" /></div>
                  beemapsy@gmail.com
                </li>
                <li>
                  <div className="bc-contact-icon"><MapPin size={13} color="rgba(255,255,255,0.8)" /></div>
                  Lot D railway siding Cnr Robert Mugabe and Grenara
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="bc-footer-divider" />

        <div className="bc-footer-bottom">
          <p className="bc-footer-copy">
            © {new Date().getFullYear()} <span>Bee Cars</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}