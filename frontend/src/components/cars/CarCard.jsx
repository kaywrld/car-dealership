import { useState, useEffect, useRef } from 'react'
import { Fuel, Gauge, Settings2, MapPin, Zap, Cpu, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function CarCard({ car, onShowMore, onEdit, onDelete, isHire = false }) {

  // ── Normalize photos ──────────────────────────────────────────
  const photos = (() => {
    if (Array.isArray(car.images) && car.images.length > 0) return car.images
    if (typeof car.images === 'string') {
      try {
        const parsed = JSON.parse(car.images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch {}
    }
    if (car.image_url) return [car.image_url]
    if (car.image)     return [car.image]
    return []
  })()

  // ── Format date ──────────────────────────────────────────────
  const formatDate = (isoString) => {
    if (!isoString) return null
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const wasEdited    = car.updated_at && car.created_at &&
                      new Date(car.updated_at) - new Date(car.created_at) > 60_000 // > 1 min diff
  const displayDate  = wasEdited ? formatDate(car.updated_at) : formatDate(car.created_at)
  const dateLabel    = wasEdited ? 'Updated' : 'Listed'

  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState('next')
  const [animKey, setAnimKey]     = useState(0)
  const timerRef = useRef(null)
  const { dealer } = useAuth()
  const cardRef = useRef(null)

  const navigate = (newIdx, dir) => {
    setDirection(dir)
    setActiveIdx(newIdx)
    setAnimKey(k => k + 1)
  }

  const goNext = (e) => {
    e?.stopPropagation()
    navigate((activeIdx + 1) % photos.length, 'next')
  }

  const goPrev = (e) => {
    e?.stopPropagation()
    navigate((activeIdx - 1 + photos.length) % photos.length, 'prev')
  }

  const goTo = (i, e) => {
    e?.stopPropagation()
    navigate(i, i > activeIdx ? 'next' : 'prev')
  }

  useEffect(() => {
    if (photos.length <= 1) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % photos.length
        setDirection('next')
        setAnimKey(k => k + 1)
        return next
      })
    }, 8000)
    return () => clearInterval(timerRef.current)
  }, [photos.length])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('card-visible') },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleCardClick = (e) => {
    if (e.target.closest('[data-no-modal]')) return
    onShowMore(car)
  }

  // ── Normalize fields — handle both camelCase and snake_case from DB ──
  const city       = car.city || car.location || null
  // Engine size: DB may store as engine_size (snake_case) or engineSize (camelCase)
  const engineSize = car.engine_size || car.engineSize || null
  // Hybrid: DB may store as is_hybrid (bool) or isHybrid ('Yes'/'No')
  const isHybrid   = car.is_hybrid === true || car.isHybrid === 'Yes'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800;900&display=swap');

        .bee-card {
          background: #ffffff;
          border: 1px solid #dde5f0;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.38s ease,
                      border-color 0.3s ease;
          box-shadow: 0 2px 14px rgba(0,30,100,0.08);
        }
        .bee-card:hover {
          transform: translateY(-7px) scale(1.005);
          box-shadow: 0 22px 52px rgba(0,30,100,0.16);
          border-color: #aac4e8;
        }

        .card-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2), transform 0.65s cubic-bezier(.22,.68,0,1.2);
        }
        .card-reveal.card-visible {
          opacity: 1;
          transform: none;
        }

        .bee-slide-next {
          animation: slideInNext 2.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }
        .bee-slide-prev {
          animation: slideInPrev 2.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }
        @keyframes slideInNext {
          from { opacity: 0; transform: scale(1.06) translateX(18px); }
          to   { opacity: 1; transform: scale(1)    translateX(0);     }
        }
        @keyframes slideInPrev {
          from { opacity: 0; transform: scale(1.06) translateX(-18px); }
          to   { opacity: 1; transform: scale(1)    translateX(0);     }
        }

        .bee-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,60,160,0.18);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 5;
          opacity: 0; transition: opacity 0.22s, background 0.2s;
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
        .bee-img-wrap:hover .bee-arrow { opacity: 1; }
        .bee-arrow:hover { background: #0045a0; }
        .bee-arrow:hover svg { color: #fff; }
        .bee-arrow-left  { left: 10px; }
        .bee-arrow-right { right: 10px; }

        .bee-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(255,255,255,0.45);
          border: none; padding: 0; cursor: pointer; flex-shrink: 0;
          transition: width 0.35s ease, background 0.3s, border-radius 0.35s;
        }
        .bee-dot.active {
          width: 20px; border-radius: 3px;
          background: rgba(255,255,255,0.95);
        }

        .bee-view-btn {
          width: 100%;
          background: #0a1f5c;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 15px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 12px 16px; border-radius: 10px;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .bee-view-btn:hover  { background: #0045a0; transform: translateY(-1px); }
        .bee-view-btn:active { transform: scale(0.98); }

        .bee-edit-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase;
          color: #0045a0; background: #eef3fc;
          border: 1px solid #c4d8f5; border-radius: 9px;
          padding: 9px; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .bee-edit-btn:hover { background: #0045a0; color: #fff; border-color: #0045a0; }

        .bee-del-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase;
          color: #b03030; background: #fdf0f0;
          border: 1px solid #f0c8c8; border-radius: 9px;
          padding: 9px; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .bee-del-btn:hover { background: #c0392b; color: #fff; border-color: #c0392b; }

        .bee-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #dce6f5, transparent);
          margin: 12px 0;
        }

        .bee-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 500;
          border-radius: 6px; padding: 5px 10px;
        }
      `}</style>

      <div ref={cardRef} className="card-reveal">
        <div className="bee-card" onClick={handleCardClick}>

          {/* ── IMAGE AREA ── */}
          <div
            className="bee-img-wrap"
            style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#d8e4f0', flexShrink: 0 }}
          >
            {photos.length > 0 ? (
              <img
                key={`${animKey}-${activeIdx}`}
                src={photos[activeIdx]}
                alt={`${car.year} ${car.make} ${car.model}`}
                loading="eager"
                className={direction === 'next' ? 'bee-slide-next' : 'bee-slide-prev'}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8aadcc', fontFamily: "'Barlow', sans-serif", fontSize: 14,
              }}>
                No photo available
              </div>
            )}

            {/* Dark gradient */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(0,8,30,0.88) 0%, rgba(0,8,30,0.25) 52%, transparent 100%)',
            }} />

            {/* Arrows */}
            {photos.length > 1 && (
              <>
                <button data-no-modal className="bee-arrow bee-arrow-left" onClick={goPrev}>
                  <ChevronLeft size={15} color="#0045a0" />
                </button>
                <button data-no-modal className="bee-arrow bee-arrow-right" onClick={goNext}>
                  <ChevronRight size={15} color="#0045a0" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {photos.length > 1 && (
              <div
                data-no-modal
                style={{
                  position: 'absolute', bottom: 48, left: 0, right: 0, zIndex: 3,
                  display: 'flex', justifyContent: 'center', gap: 5, pointerEvents: 'auto',
                }}
              >
                {photos.map((_, i) => (
                  <button
                    key={i}
                    data-no-modal
                    className={`bee-dot${i === activeIdx ? ' active' : ''}`}
                    onClick={(e) => goTo(i, e)}
                  />
                ))}
              </div>
            )}

            {/* Availability badge */}
            <span style={{
              position: 'absolute', top: 12, right: 12, zIndex: 4,
              background: car.sold ? 'rgba(180, 30, 30, 0.92)' : 'rgba(0, 69, 160, 0.92)',
              color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', padding: '4px 11px',
              borderRadius: 20, fontFamily: "'Barlow Condensed', sans-serif",
              backdropFilter: 'blur(4px)',
              border: car.sold ? '1px solid rgba(231,76,60,0.60)' : '1px solid rgba(46,204,113,0.50)',
            }}>
              {car.sold ? 'SOLD OUT' : 'AVAILABLE'}
            </span>

            {/* Custom badge */}
            {car.badge && (
              <span style={{
                position: 'absolute', top: 12, left: 12, zIndex: 4,
                background: '#0045a0', color: '#fff',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '4px 11px',
                borderRadius: 20, fontFamily: "'Barlow Condensed', sans-serif",
              }}>
                {car.badge}
              </span>
            )}

            {/* Make / Model / Price overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, padding: '0 14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900, fontSize: 26, color: '#fff',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    lineHeight: 1, margin: 0,
                  }}>
                    {car.make}
                  </p>
                  <p style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 15,
                    color: 'rgba(210,228,255,0.92)', marginTop: 3, marginBottom: 0,
                  }}>
                    {car.model} · {car.year}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, fontSize: 24, color: '#fff',
                    lineHeight: 1, margin: 0,
                  }}>
                    ${Number(car.price).toLocaleString()}
                  </p>
                  {isHire && car.price_unit && (
                    <p style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 11,
                      color: '#9ec8ff', marginTop: 2, marginBottom: 0,
                    }}>
                      {car.price_unit}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD BODY ── */}
          <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1, background: '#fff' }}>

          {/* Location + Hybrid chips only */}
          {(city || isHybrid) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {city && (
                <span className="bee-chip" style={{
                  color: '#0045a0', background: '#eef3fc',
                  border: '1px solid #c8d8f5',
                }}>
                  <MapPin size={11} color="#0045a0" style={{ flexShrink: 0 }} />
                  {city}
                </span>
              )}
              {isHybrid && (
                <span className="bee-chip" style={{
                  color: '#0a3d20', background: '#edfaf3',
                  border: '1px solid #b6ecd0',
                }}>
                  <Zap size={11} color="#2ecc71" style={{ flexShrink: 0 }} />
                  Hybrid
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 15, fontWeight: 400,
            color: '#1a1a2e',
            lineHeight: 1.65, marginBottom: 6, flex: 1,
          }}>
            {car.summary}
          </p>

          <div className="bee-divider" style={{ margin: '6px 0' }} />

          {/* Specs row — mileage, fuel, transmission + engine size */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { Icon: Gauge,     val: `${Number(car.mileage).toLocaleString()} km` },
              { Icon: Fuel,      val: car.fuel },
              { Icon: Settings2, val: car.transmission },
              { Icon: Cpu,       val: engineSize },
            ].map(({ Icon, val }) => val ? (
              <span key={val} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: "'Barlow', sans-serif",
                fontSize: 15, fontWeight: 500, color: '#1a1a2e',
              }}>
                <Icon size={13} color="#0045a0" /> {val}
              </span>
            ) : null)}
          </div>

          {/* Date chip */}
          {displayDate && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 10,
            }}>
              <span style={{
                fontFamily: "Arial",
                fontSize: 14, fontWeight: 500,
                color: '#000000',
                border: `1px solid ${wasEdited ? 'rgba(232,168,56,0.28)' : 'rgba(0,69,160,0.15)'}`,
                borderRadius: 6,
                padding: '3px 9px',
                letterSpacing: '0.04em',
              }}>
                {dateLabel} {displayDate}
              </span>
            </div>
          )}

          {/* View Details button */}
          <button
            className="bee-view-btn"
            onClick={(e) => { e.stopPropagation(); onShowMore(car) }}
          >
            View Details →
          </button>

          {/* Dealer controls */}
          {dealer && (
            <div data-no-modal style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                data-no-modal
                className="bee-edit-btn"
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(car) }}
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                data-no-modal
                className="bee-del-btn"
                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(car.id) }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  )
}