import { X, CheckCircle2, Gauge, Fuel, Settings2, Palette, MapPin, Zap, Cpu, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import CarCard from './CarCard'

// ── Configure your dealership contact details here ──────────────────────────
const DEALER_WHATSAPP = '263771234567'   // Zimbabwe number, no + or spaces
const DEALER_PHONE    = '+263771234567'
const DEALER_EMAIL    = 'sales@beecars.co.zw'
// ────────────────────────────────────────────────────────────────────────────

// WhatsApp SVG icon (official brand mark)
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function CarModal({ car, onClose, onShowMore, isHire = false }) {
  // Multi-image support
  const photos = Array.isArray(car.images) && car.images.length > 0
    ? car.images
    : car.image ? [car.image] : []

  const [photoIdx, setPhotoIdx] = useState(0)
  const [fading, setFading]     = useState(false)
  const [similarCars, setSimilarCars] = useState([])

  // Auto-cycle
  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setPhotoIdx(p => (p + 1) % photos.length); setFading(false) }, 600)
    }, 4500)
    return () => clearInterval(id)
  }, [photos.length])

  const goTo = (idx) => {
    setFading(true)
    setTimeout(() => { setPhotoIdx(idx); setFading(false) }, 300)
  }
  const prev = (e) => { e.stopPropagation(); goTo((photoIdx - 1 + photos.length) % photos.length) }
  const next = (e) => { e.stopPropagation(); goTo((photoIdx + 1) % photos.length) }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  goTo((photoIdx - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') goTo((photoIdx + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose, photoIdx, photos.length])

  // Contact helpers
  const carLabel = `${car.year} ${car.make} ${car.model} — $${car.price.toLocaleString()}`
  const waMsg    = encodeURIComponent(
    isHire
      ? `Hi, I'm interested in hiring the ${carLabel}. Could you share availability and terms?`
      : `Hi, I'd like to enquire about the ${carLabel}. Is it still available?`
  )
  const emailSubject = encodeURIComponent(
    isHire ? `Hire Enquiry: ${carLabel}` : `Purchase Enquiry: ${carLabel}`
  )
  const emailBody = encodeURIComponent(
    isHire
      ? `Hello,\n\nI'm interested in hiring the ${carLabel}.\n\nPlease send me availability and hire terms.\n\nThank you.`
      : `Hello,\n\nI'm interested in purchasing the ${carLabel}.\n\nPlease let me know if it's available.\n\nThank you.`
  )

  const contacts = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/${DEALER_WHATSAPP}?text=${waMsg}`,
      Icon: WhatsAppIcon,
      bg: '#128C7E',
      hover: '#075E54',
      border: '#25D366',
    },
    {
      label: 'Call Us',
      href: `tel:${DEALER_PHONE}`,
      Icon: Phone,
      bg: 'rgba(0,69,160,0.55)',
      hover: '#0045a0',
      border: 'rgba(0,120,255,0.50)',
    },
    {
      label: 'Email',
      href: `mailto:${DEALER_EMAIL}?subject=${emailSubject}&body=${emailBody}`,
      Icon: Mail,
      bg: 'rgba(30,10,80,0.55)',
      hover: '#3b0090',
      border: 'rgba(140,80,255,0.45)',
    },
  ]

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then(r => r.json())
      .then(all => {
        const range = all.filter(c =>
          c.id !== car.id &&
          Math.abs(Number(c.price) - Number(car.price)) <= 1000
        )
        setSimilarCars(range)
      })
      .catch(console.error)
  }, [car.id, car.price])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.90)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-contact-btn:hover { filter: brightness(1.12); transform: translateY(-2px) !important; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(0,69,160,0.35)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0,10,50,0.85)',
          animation: 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ── IMAGE HEADER ─────────────────────────────────── */}
        <div style={{ position: 'relative', height: 280, background: '#050c1f', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>

          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${car.year} ${car.make} ${car.model} — ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === photoIdx ? (fading ? 0 : 1) : 0,
                transition: 'opacity 0.6s ease-in-out',
                display: 'block',
              }}
            />
          ))}

          {/* Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(13,13,13,0.98) 0%, rgba(13,13,13,0.20) 50%, transparent 100%)',
          }} />

          {/* Prev / Next arrows — only if multiple photos */}
          {photos.length > 1 && (
            <>
              <button onClick={prev} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', borderRadius: '50%', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s', zIndex: 3,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,69,160,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
              >
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} style={{
                position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', borderRadius: '50%', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s', zIndex: 3,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,69,160,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
              >
                <ChevronRight size={16} />
              </button>

              {/* Dot indicators */}
              <div style={{
                position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 5, zIndex: 3,
              }}>
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); goTo(i) }}
                    style={{
                      width: i === photoIdx ? 18 : 6, height: 6, borderRadius: 3,
                      background: i === photoIdx ? '#4a90d9' : 'rgba(255,255,255,0.35)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'width 0.35s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, zIndex: 4,
              background: 'rgba(0,0,0,0.60)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: '50%',
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,0,0,0.75)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.60)'}
          >
            <X size={15} />
          </button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
            <div>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900, fontSize: 32, color: '#ffffff',
                letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1,
              }}>
                {car.make} {car.model}
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(180,210,255,0.85)', marginTop: 4 }}>
                {car.year} · {car.color}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: 26, color: '#ffffff', lineHeight: 1,
              }}>
                ${car.price.toLocaleString()}
              </p>
              {isHire && (
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#6fa3e8', marginTop: 3 }}>{car.priceUnit}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────── */}
        <div style={{ padding: '20px 24px 28px', background: '#0d0d0d' }}>

          {/* Location / Engine / Hybrid strip */}
          {(car.city || car.engineSize || car.isHybrid) && (
            <div style={{
              display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18,
              padding: '10px 14px',
              background: 'rgba(0,69,160,0.10)',
              border: '1px solid rgba(0,69,160,0.20)',
              borderRadius: 10,
            }}>
              {car.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(180,215,255,0.85)' }}>
                  <MapPin size={13} style={{ color: '#4a90d9' }} /> {car.city}
                </span>
              )}
              {car.engineSize && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(180,215,255,0.85)' }}>
                  <Cpu size={13} style={{ color: '#4a90d9' }} /> {car.engineSize}
                </span>
              )}
              {car.isHybrid && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#a3f0c0' }}>
                  <Zap size={13} style={{ color: '#4cd990' }} /> Hybrid
                </span>
              )}
            </div>
          )}

          {/* Specs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              [Gauge,    `${car.mileage.toLocaleString()} km`, 'Mileage'],
              [Fuel,     car.fuel,         'Fuel'],
              [Settings2, car.transmission, 'Gearbox'],
              [Palette,  car.color,        'Colour'],
            ].map(([Icon, val, label]) => (
              <div key={label} style={{
                background: 'rgba(0,40,110,0.25)',
                border: '1px solid rgba(0,69,160,0.22)',
                borderRadius: 10, padding: '12px 8px', textAlign: 'center',
              }}>
                <Icon size={15} style={{ color: '#4a90d9', margin: '0 auto 6px' }} />
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: '#ffffff', letterSpacing: '0.03em' }}>{val}</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(120,170,230,0.55)', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13, fontWeight: 300,
            color: 'rgba(200,220,255,0.70)',
            lineHeight: 1.7, marginBottom: 20,
          }}>
            {car.details}
          </p>

          {/* Features */}
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#4a90d9', marginBottom: 12,
          }}>
            Key Features
          </p>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 26 }}>
            {car.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={13} style={{ color: '#0045a0', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(210,230,255,0.85)' }}>{f}</span>
              </li>
            ))}
          </ul>

          {/* ── CONTACT SECTION ──────────────────────────── */}
          <div style={{
            borderTop: '1px solid rgba(0,69,160,0.20)',
            paddingTop: 20,
          }}>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 11,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#4a90d9', marginBottom: 14,
            }}>
              {isHire ? 'Book This Car' : 'Buy This Car'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {contacts.map(({ label, href, Icon, bg, hover, border }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-contact-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 10px',
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 12,
                    color: '#ffffff',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s, transform 0.2s, filter 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = hover; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <Icon size={20} />
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 12,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                  }}>
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* Subtle contact info line */}
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11, color: 'rgba(120,160,220,0.45)',
              textAlign: 'center', marginTop: 12,
            }}>
              {DEALER_PHONE} · {DEALER_EMAIL}
            </p>
          </div>

          {/* ── SIMILAR PRICE CARS ─────────────────────────────── */}
          {similarCars.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(0,69,160,0.20)', paddingTop: 20, marginTop: 20 }}>
              <p style={{
                fontFamily: "Arial",
                fontWeight: 700, fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#4a90d9', marginBottom: 14,
              }}>
                Cars with similar prices
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {similarCars.map(c => (
                  <CarCard
                    key={c.id}
                    car={c}
                    onShowMore={(clicked) => { onClose(); setTimeout(() => onShowMore(clicked), 50) }}
                    isHire={isHire}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '12px 0',
              background: 'transparent',
              border: '1px solid rgba(0,69,160,0.30)',
              color: 'rgba(140,180,240,0.65)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 12,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              borderRadius: 10, cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6be0'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,69,160,0.30)'; e.currentTarget.style.color = 'rgba(140,180,240,0.65)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}