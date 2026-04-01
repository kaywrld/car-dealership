import { useState, useEffect, useRef } from 'react'
import CarsForSale from './CarsForSale'
import CarsForHire from './CarsForHire'
import { ShoppingCart, Key, ChevronDown, ChevronUp } from 'lucide-react'
import bgImage from '../../assets/background.jpg'
import { fetchMakes } from '../../services/api'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, dir = 'up', delay = 0, style = {} }) {
  const ref = useReveal()
  const cls = dir === 'left' ? 'home-reveal-left' : dir === 'right' ? 'home-reveal-right' : 'home-reveal'
  return (
    <div ref={ref} className={cls} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  )
}

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1800&q=90' },
  { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1800&q=90' },
  { url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=90' },
  { url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1800&q=90' },
]

const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Mazda', 'Many More']

export default function Home() {
  const [activeTab, setActiveTab] = useState('sale')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fading, setFading] = useState(false)
  const [makes, setMakes] = useState([])
  const [selectedMake, setSelectedMake] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length)
        setFading(false)
      }, 700)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image()
      img.src = slide.url
    })
  }, [])

  useEffect(() => {
    fetchMakes().then(setMakes).catch(console.error)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (!e.target.closest('[data-make-dropdown]')) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const handleMakeSelect = (make) => {
    setSelectedMake(make)
    setDropdownOpen(false)
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: "'Barlow', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');

        :root {
          --brand: #0045a0;
          --brand-light: #1a6be0;
          --brand-dark: #002f70;
          --bg: #03091a;
          --surface: #070f2280;
          --text-primary: #f0f4ff;
          --text-muted: #8ba4cc;
        }

        .home-reveal       { opacity:0; transform:translateY(32px); transition:opacity .7s cubic-bezier(.22,.68,0,1.2), transform .7s cubic-bezier(.22,.68,0,1.2); }
        .home-reveal-left  { opacity:0; transform:translateX(-40px); transition:opacity .75s ease, transform .75s ease; }
        .home-reveal-right { opacity:0; transform:translateX(40px);  transition:opacity .75s ease, transform .75s ease; }
        .home-reveal.visible, .home-reveal-left.visible, .home-reveal-right.visible { opacity:1; transform:none; }

        .hero-bg { transition: opacity 0.7s ease; }
        .hero-bg.fading { opacity: 0; }

        .cta-primary {
          background: var(--brand);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 26px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .cta-primary:hover { background: var(--brand-light); transform: translateY(-2px); }

        .cta-outline {
          background: transparent;
          color: #c9d8f0;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 9px 26px;
          border-radius: 6px;
          border: 1.5px solid rgba(0,69,160,0.6);
          font-size: 12px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .cta-outline:hover { border-color: var(--brand-light); color: #fff; transform: translateY(-2px); }

        .stat-card {
          background: rgba(0,69,160,0.10);
          border: 1px solid rgba(0,69,160,0.22);
          border-radius: 10px;
          padding: 12px 20px;
          text-align: center;
          backdrop-filter: blur(8px);
        }

        .listings-tab-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-size: 14px;
          padding: 16px 20px;
          background: transparent;
          border: none;
          color: rgba(180, 210, 255, 0.55);
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          flex: 1;
          justify-content: center;
        }
        .listings-tab-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: #ffffff;
          border-radius: 2px 2px 0 0;
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .listings-tab-btn.active { color: #ffffff; }
        .listings-tab-btn.active::after { transform: scaleX(1); }
        .listings-tab-btn:hover:not(.active) { color: rgba(220,235,255,0.85); }

        .dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none; padding: 0;
        }
        .dot.active { background: #fff; width: 24px; border-radius: 4px; }

        .scroll-hint { animation: bounce 2.4s ease infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.9; }
        }

        /* Make dropdown */
        .make-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0; right: 0;
          background: #001a5e;
          border: 1px solid rgba(26,107,224,0.40);
          border-radius: 10px;
          overflow: hidden;
          z-index: 100;
          box-shadow: 0 12px 36px rgba(0,0,0,0.50);
          max-height: 260px;
          overflow-y: auto;
        }
        .make-dropdown-menu::-webkit-scrollbar { width: 4px; }
        .make-dropdown-menu::-webkit-scrollbar-track { background: transparent; }
        .make-dropdown-menu::-webkit-scrollbar-thumb { background: rgba(26,107,224,0.40); border-radius: 2px; }

        .make-option {
          padding: 11px 16px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(200,225,255,0.80);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .make-option:hover { background: rgba(26,107,224,0.25); color: #fff; }
        .make-option.selected { background: rgba(26,107,224,0.35); color: #fff; font-weight: 600; }
        .make-option-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(26,107,224,0.50); flex-shrink: 0;
        }
        .make-option.selected .make-option-dot { background: #fff; }

        /* Mobile: remove side padding so inventory panel bleeds edge to edge */
        @media (max-width: 640px) {
          .listings-header-inner { flex-direction: column !important; }
          .listings-stat-pills { justify-content: flex-start !important; }
          .listings-outer { padding-left: 0 !important; padding-right: 0 !important; }
          .listings-panel {
            border-radius: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
          .listings-content { padding-left: 12px !important; padding-right: 12px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="relative" style={{ height: '80vh', overflow: 'hidden' }}>
        <div
          className={`hero-bg absolute inset-0 ${fading ? 'fading' : ''}`}
          style={{ backgroundImage: `url('${heroSlides[currentSlide].url}')`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,15,50,0.72) 0%, rgba(0,45,112,0.65) 40%, rgba(3,9,26,0.95) 100%)',
        }} />
        {heroSlides.map((slide, i) => <link key={i} rel="preload" as="image" href={slide.url} />)}

        {/* Top brand bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 py-7" style={{ zIndex: 20 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.18em', color: '#fff' }}>
            AUTO<span style={{ color: '#1a6be0' }}>ELITE</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Inventory', 'Hire', 'Finance', 'Contact'].map(item => (
              <span key={item} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', color: 'rgba(200,220,255,0.7)', cursor: 'pointer', textTransform: 'uppercase' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-start text-center" style={{ zIndex: 10, padding: '130px 24px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 2, background: '#0045a0', borderRadius: 2 }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#6fa3e8' }}>
              Zimbabwe's #1 Car Dealer
            </span>
            <div style={{ width: 32, height: 2, background: '#0045a0', borderRadius: 2 }} />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 5vw, 62px)', lineHeight: 1, letterSpacing: '-0.01em', color: '#fff', marginBottom: 14, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Premium{' '}
            <span style={{ color: '#0045a0', WebkitTextStroke: '1.5px #1a6be0', WebkitTextFillColor: 'transparent' }}>Quality Cars</span>
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, fontWeight: 300, color: '#ffffff', marginBottom: 12, letterSpacing: '0.02em', lineHeight: 1.6, maxWidth: 460 }}>
            BEE CARS your trusted destination for buying and renting premium vehicles. All brands, all budgets, unmatched service.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
            {brands.map(brand => (
              <span key={brand} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(0,69,160,0.18)', border: '1px solid rgba(0,69,160,0.35)', borderRadius: 4, padding: '4px 10px' }}>
                {brand}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="cta-primary" onClick={() => { setActiveTab('sale'); document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <ShoppingCart size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Browse for Sale
            </button>
            <button className="cta-outline" onClick={() => { setActiveTab('hire'); document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <Key size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Cars for Hire
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'nowrap', justifyContent: 'center' }}>
            {[{ value: '100+', label: 'Vehicles Available' }, { value: '4 Yrs', label: 'In Business' }, { value: '4.9★', label: 'Customer Rating' }].map(stat => (
              <div className="stat-card" key={stat.label}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.01em' }}>{stat.value}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#6fa3e8', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 20 }}>
          {heroSlides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
        <div className="scroll-hint" style={{ position: 'absolute', bottom: 72, left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'rgba(100,150,220,0.5)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Barlow', sans-serif", zIndex: 20 }}>
          <ChevronDown size={16} />
          Scroll
        </div>
      </div>

      {/* ── Listings ── */}
      <div
        className="listings-outer"
        id="listings"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          paddingLeft: 'clamp(0px, 2vw, 32px)',
          paddingRight: 'clamp(0px, 2vw, 32px)',
          paddingTop: 0,
          paddingBottom: 80,
        }}
      >
        <Reveal>
          {/* Blue header panel */}
          <div
            className="listings-panel"
            style={{
              background: 'linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%)',
              border: '1px solid rgba(0,110,230,0.30)',
              borderRadius: 'clamp(0px, 2vw, 20px)',
              marginBottom: 36,
            }}
          >
            {/* Heading + stat pills */}
            <div
              className="listings-header-inner"
              style={{
                padding: '28px clamp(16px, 4vw, 32px) 24px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                borderBottom: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div>
                <div style={{ width: 48, height: 3, background: 'rgba(255,255,255,0.40)', borderRadius: 2, marginBottom: 12 }} />
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 38, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#ffffff', lineHeight: 1, marginBottom: 8 }}>
                  Our Inventory
                </h2>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(200,225,255,0.70)' }}>
                  Handpicked, inspected, and ready for you.
                  Choose whether you want to buy or hire a car. Once you’ve decided, proceed without hesitation to view the details, complete your purchase, and enjoy the ride.
                </p>
              </div>
            </div>

            {/* Tab row */}
            <div style={{ display: 'flex', padding: '0 clamp(0px, 2vw, 32px)' }}>
              <button className={`listings-tab-btn ${activeTab === 'sale' ? 'active' : ''}`} onClick={() => setActiveTab('sale')}>
                <ShoppingCart size={14} />
                Cars for Sale
              </button>
              <button className={`listings-tab-btn ${activeTab === 'hire' ? 'active' : ''}`} onClick={() => setActiveTab('hire')}>
                <Key size={14} />
                Cars for Hire
              </button>
            </div>

            {/* Make filter dropdown */}
            <div style={{ padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 32px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div data-make-dropdown style={{ position: 'relative', maxWidth: 320 }}>

                {/* Trigger button */}
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(0,20,70,0.55)',
                    border: `1px solid ${dropdownOpen ? 'rgba(26,107,224,0.70)' : 'rgba(26,107,224,0.30)'}`,
                    borderRadius: 10,
                    padding: '11px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, color: selectedMake ? '#fff' : 'rgba(160,200,255,0.55)' }}>
                    {selectedMake || 'Filter by Car Name…'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {selectedMake && (
                      <span
                        onClick={(e) => { e.stopPropagation(); setSelectedMake('') }}
                        style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(160,200,255,0.55)', cursor: 'pointer', padding: '0 4px' }}
                        title="Clear filter"
                      >
                        ✕
                      </span>
                    )}
                    {dropdownOpen
                      ? <ChevronUp size={14} color="rgba(160,200,255,0.60)" />
                      : <ChevronDown size={14} color="rgba(160,200,255,0.60)" />
                    }
                  </span>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="make-dropdown-menu">
                    <button className={`make-option ${selectedMake === '' ? 'selected' : ''}`} onClick={() => handleMakeSelect('')}>
                      <span className="make-option-dot" />
                      All Makes
                    </button>
                    {makes.map(make => (
                      <button
                        key={make}
                        className={`make-option ${selectedMake === make ? 'selected' : ''}`}
                        onClick={() => handleMakeSelect(make)}
                      >
                        <span className="make-option-dot" />
                        {make}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tab content */}
        <div className="listings-content" key={activeTab}>
          {activeTab === 'sale'
            ? <CarsForSale filterMake={selectedMake} />
            : <CarsForHire filterMake={selectedMake} />
          }
        </div>
      </div>
    </div>
  )
}