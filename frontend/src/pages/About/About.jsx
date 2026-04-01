import { useEffect, useRef } from 'react'
import { Shield, Star, Users, Award } from 'lucide-react'
import bgImage from '../../assets/background.jpg'

const stats = [
  { icon: Star,   value: '500+',   label: 'Cars Sold' },
  { icon: Users,  value: '800+', label: 'Happy Clients' },
  { icon: Shield, value: '100%',   label: 'Verified Vehicles' },
  { icon: Award,  value: '4 Yrs',  label: 'In Business' },
]

const carShowcase = [
  { img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=700&q=80', name: 'Toyota Camry',      tag: 'Brand New · From $28,000' },
  { img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80',    name: 'BMW 3 Series',     tag: 'Pre-Owned · From $22,500' },
  { img: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=700&q=80', name: 'Mercedes C-Class', tag: 'Brand New · From $45,000' },
]

const visionPillars = [
  { title: 'Quality',   body: 'Every vehicle inspected to the highest standard before hitting our lot.' },
  { title: 'Integrity', body: 'Transparent pricing, honest advice, zero pressure sales tactics.' },
  { title: 'Service',   body: 'Dedicated support from first inquiry to long after your purchase.' },
  { title: 'Access',    body: 'Finance options for every budget — brand new to certified pre-owned.' },
]

const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Mazda', 'Ford']

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
  const cls = dir === 'left' ? 'abt-reveal-left' : dir === 'right' ? 'abt-reveal-right' : 'abt-reveal'
  return (
    <div ref={ref} className={cls} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');

        /* ── Page wrapper — full-height static background ── */
        .abt-root {
          min-height: 100vh;
          font-family: 'Barlow', sans-serif;
          color: #e8eeff;
          overflow-x: hidden;
          position: relative;
          /* The background image is set via inline style using the imported asset */
          background-attachment: fixed;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        /* Dark overlay that sits over the bg image for the whole page */
        .abt-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(0, 5, 20, 0.82);
          z-index: 0;
          pointer-events: none;
        }

        /* All direct content needs z-index above the overlay */
        .abt-root > * { position: relative; z-index: 1; }

        /* ── Reveal animations ── */
        .abt-reveal       { opacity:0; transform:translateY(36px); transition:opacity .75s cubic-bezier(.22,.68,0,1.2), transform .75s cubic-bezier(.22,.68,0,1.2); }
        .abt-reveal-left  { opacity:0; transform:translateX(-44px); transition:opacity .8s ease, transform .8s ease; }
        .abt-reveal-right { opacity:0; transform:translateX(44px);  transition:opacity .8s ease, transform .8s ease; }
        .abt-reveal.visible, .abt-reveal-left.visible, .abt-reveal-right.visible { opacity:1; transform:none; }

        /* ── Blue text-background highlight ── */
        /* Applied to every section wrapper that doesn't have its own image bg */
        .abt-section-bg {
          background: rgba(0, 69, 160, 0.18);
          border-top: 1px solid rgba(0, 90, 200, 0.22);
          border-bottom: 1px solid rgba(0, 90, 200, 0.22);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Tighter inner version for vision band */
        .abt-section-bg-deep {
          background: rgba(0, 45, 130, 0.30);
          border-top: 1px solid rgba(0, 90, 200, 0.28);
          border-bottom: 1px solid rgba(0, 90, 200, 0.28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        /* ── Stat cards ── */
        .abt-stat {
          background: rgba(0, 69, 160, 0.28);
          border: 1px solid rgba(0, 100, 220, 0.35);
          border-radius: 14px; padding: 26px 16px; text-align: center;
          backdrop-filter: blur(10px);
          transition: border-color .3s, transform .3s, box-shadow .3s;
        }
        .abt-stat:hover {
          border-color: rgba(0, 130, 255, 0.65);
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(0, 50, 160, 0.45);
        }

        /* ── Vision pillars ── */
        .abt-pillar {
          background: rgba(0, 50, 140, 0.32);
          border: 1px solid rgba(0, 90, 200, 0.30);
          border-radius: 14px; padding: 22px; position: relative; overflow: hidden;
          backdrop-filter: blur(8px);
          transition: border-color .3s, transform .3s;
        }
        .abt-pillar:hover { border-color: rgba(0, 120, 255, 0.55); transform: translateY(-3px); }
        .abt-pillar::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, #1a6be0, transparent);
        }

        /* ── Car thumbnail ── */
        .abt-thumb { position:relative; border-radius:14px; overflow:hidden; aspect-ratio:16/10; }
        .abt-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .55s ease; display:block; }
        .abt-thumb:hover img { transform:scale(1.07); }
        .abt-thumb-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,10,40,.90) 0%,transparent 55%); display:flex; align-items:flex-end; padding:16px; }

        /* ── Image frame ── */
        .abt-img-frame { position:relative; border-radius:18px; overflow:hidden; aspect-ratio:4/3; }
        .abt-img-frame img { width:100%; height:100%; object-fit:cover; transition:transform .6s ease; display:block; }
        .abt-img-frame:hover img { transform:scale(1.04); }
        .abt-img-frame::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,50,160,.22) 0%,transparent 60%); pointer-events:none; }

        /* ── Eyebrow label ── */
        .abt-eyebrow { font-size:11px; font-weight:600; letter-spacing:.26em; text-transform:uppercase; color:#7ab4ff; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .abt-2col    { grid-template-columns: 1fr !important; gap: 36px !important; }
          .abt-4col    { grid-template-columns: repeat(2,1fr) !important; }
          .abt-3col    { grid-template-columns: 1fr !important; gap: 14px !important; }
          .abt-2col-sm { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .abt-4col    { grid-template-columns: repeat(2,1fr) !important; }
          .abt-2col-sm { grid-template-columns: 1fr !important; }
          .abt-section-pad { padding-left: 18px !important; padding-right: 18px !important; }

          /* Larger text on mobile */
          .abt-body-text  { font-size: 16px !important; line-height: 1.85 !important; }
          .abt-h2         { font-size: 36px !important; }
          .abt-stat-val   { font-size: 28px !important; }
          .abt-stat-label { font-size: 11px !important; }
          .abt-pillar-title { font-size: 15px !important; }
          .abt-pillar-body  { font-size: 14px !important; }
          .abt-eyebrow    { font-size: 12px !important; }
          .abt-thumb-name { font-size: 15px !important; }
          .abt-thumb-tag  { font-size: 12px !important; }
        }
      `}</style>

      <div
        className="abt-root"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >

        {/* ══════════════════════════════════════════════
            HERO — shorter, centred, text over static bg
        ══════════════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          minHeight: '46vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '100px 24px 64px',
        }}>
          {/* Extra gradient fade at bottom so hero blends into next section */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to bottom, transparent, rgba(0,5,20,0.60))',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
            <Reveal delay={0.05}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ width:28, height:2, background:'#0045a0', borderRadius:2 }} />
                <span className="abt-eyebrow">Our Story</span>
                <div style={{ width:28, height:2, background:'#0045a0', borderRadius:2 }} />
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <h1 style={{
                fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
                fontSize:'clamp(44px,8vw,80px)',
                textTransform:'uppercase', letterSpacing:'-0.01em',
                lineHeight:1, color:'#fff', marginBottom:18,
              }}>
                About{' '}
                <span style={{ WebkitTextStroke:'2px #2a7aff', WebkitTextFillColor:'transparent' }}>
                  BEE CARS
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="abt-body-text" style={{
                fontSize:16, fontWeight:300, lineHeight:1.78,
                color:'rgba(190,215,255,0.82)', maxWidth:500, margin:'0 auto',
              }}>
                Founded on a simple belief buying or hiring a premium car should be as special as driving one.
              </p>
            </Reveal>

            <Reveal delay={0.32}>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginTop:30 }}>
                <div style={{ width:36, height:1, background:'rgba(0,100,255,0.45)' }} />
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#0045a0' }} />
                <div style={{ width:36, height:1, background:'rgba(0,100,255,0.45)' }} />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════ */}
        <div className="abt-section-bg">
          <div style={{ maxWidth:1140, margin:'0 auto', padding:'60px 36px' }} className="abt-section-pad">
            <div className="abt-4col" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
              {stats.map(({ icon: Icon, value, label }, i) => (
                <Reveal key={label} delay={i * 0.09}>
                  <div className="abt-stat">
                    <div style={{ width:42, height:42, background:'rgba(0,69,160,.35)', border:'1px solid rgba(0,110,255,.40)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                      <Icon size={18} color="#7ab4ff" />
                    </div>
                    <div className="abt-stat-val" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:32, color:'#fff', lineHeight:1 }}>{value}</div>
                    <div className="abt-stat-label" style={{ fontSize:10, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'#7ab4ff', marginTop:6 }}>{label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MISSION SPLIT
        ══════════════════════════════════════════════ */}
        <div style={{ padding:'88px 0' }}>
          <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 36px' }} className="abt-section-pad">
            <div className="abt-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

              <Reveal dir="left">
                <div className="abt-img-frame">
                  <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80" alt="BMW showroom" loading="lazy" />
                  <div style={{ position:'absolute', bottom:18, left:18, background:'rgba(0,8,30,.90)', border:'1px solid rgba(0,80,200,.50)', borderRadius:8, padding:'10px 16px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.09em', textTransform:'uppercase', color:'#fff', backdropFilter:'blur(8px)', zIndex:2 }}>
                    Fleet of <span style={{ color:'#7ab4ff' }}>Brand New</span> Cars
                  </div>
                </div>
              </Reveal>

              <Reveal dir="right">
                {/* Text block with #0045a0 background */}
                <div style={{ background:'rgba(0,69,160,0.22)', border:'1px solid rgba(0,100,220,0.28)', borderRadius:16, padding:'28px 28px 28px', backdropFilter:'blur(10px)' }}>
                  <p className="abt-eyebrow" style={{ marginBottom:10 }}>What We Do</p>
                  <div style={{ width:44, height:3, background:'#1a6be0', borderRadius:2, marginBottom:16 }} />
                  <h2 className="abt-h2" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'clamp(28px,4vw,44px)', textTransform:'uppercase', letterSpacing:'-0.01em', color:'#f0f4ff', lineHeight:1.05 }}>
                    Our Mission
                  </h2>
                  <p className="abt-body-text" style={{ fontSize:15, fontWeight:300, lineHeight:1.88, color:'rgba(190,215,255,.80)', marginTop:16 }}>
                    We stock both <strong style={{ color:'#fff', fontWeight:600 }}>brand new</strong> and carefully selected pre owned vehicles. Every car undergoes a rigorous 150 point inspection before it ever reaches our floor. No hidden surprises just transparent deals and exceptional machines.
                  </p>
                  <p className="abt-body-text" style={{ fontSize:15, fontWeight:300, lineHeight:1.88, color:'rgba(190,215,255,.80)', marginTop:12 }}>
                    From zero kilometre showroom models to certified pre owned gems, we cater to every budget without compromising on quality.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            CAR SHOWCASE
        ══════════════════════════════════════════════ */}
        <div className="abt-section-bg">
          <div style={{ maxWidth:1140, margin:'0 auto', padding:'72px 36px' }} className="abt-section-pad">
            <Reveal>
              <p className="abt-eyebrow" style={{ marginBottom:10 }}>What's in the Lot</p>
              <div style={{ width:44, height:3, background:'#1a6be0', borderRadius:2, marginBottom:16 }} />
              <h2 className="abt-h2" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'clamp(28px,4vw,44px)', textTransform:'uppercase', letterSpacing:'-0.01em', color:'#f0f4ff', marginBottom:32 }}>
                Cars We Carry
              </h2>
            </Reveal>
            <div className="abt-3col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
              {carShowcase.map(({ img, name, tag }, i) => (
                <Reveal key={name} delay={i * 0.10}>
                  <div className="abt-thumb">
                    <img src={img} alt={name} loading="lazy" />
                    <div className="abt-thumb-overlay">
                      <div>
                        <div className="abt-thumb-name" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff' }}>{name}</div>
                        <div className="abt-thumb-tag" style={{ fontSize:11, color:'#7ab4ff', letterSpacing:'0.06em', marginTop:3 }}>{tag}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            VISION BAND
        ══════════════════════════════════════════════ */}
        <div className="abt-section-bg-deep" style={{ padding:'80px 0' }}>
          <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 36px' }} className="abt-section-pad">
            <div className="abt-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center' }}>

              <Reveal dir="left">
                <p className="abt-eyebrow" style={{ marginBottom:16 }}>Our Vision</p>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'clamp(24px,3.5vw,42px)', letterSpacing:'-0.01em', color:'#fff', lineHeight:1.22, textTransform:'uppercase' }}>
                  To be Southern Africa's most trusted name in{' '}
                  <span style={{ WebkitTextStroke:'1.5px #2a7aff', WebkitTextFillColor:'transparent' }}>premium</span>{' '}
                  automotive retail &amp; mobility.
                </p>
                <p className="abt-body-text" style={{ fontSize:15, fontWeight:300, lineHeight:1.88, color:'rgba(190,215,255,.78)', marginTop:20, maxWidth:400 }}>
                  We're building a future where every Zimbabwean regardless of budget has access to a safe, reliable, stylish vehicle they're proud to drive.
                </p>
              </Reveal>

              <div className="abt-2col-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {visionPillars.map(({ title, body }, i) => (
                  <Reveal key={title} delay={i * 0.09}>
                    <div className="abt-pillar">
                      <div className="abt-pillar-title" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'0.06em', textTransform:'uppercase', color:'#fff', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:6, height:6, background:'#1a6be0', borderRadius:'50%', flexShrink:0 }} />
                        {title}
                      </div>
                      <p className="abt-pillar-body" style={{ fontSize:13, fontWeight:300, lineHeight:1.82, color:'rgba(190,215,255,.75)' }}>{body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            WHY CHOOSE US
        ══════════════════════════════════════════════ */}
        <div style={{ padding:'88px 0 100px' }}>
          <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 36px' }} className="abt-section-pad">
            <div className="abt-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

              <Reveal dir="left">
                {/* Text block with #0045a0 background */}
                <div style={{ background:'rgba(0,69,160,0.22)', border:'1px solid rgba(0,100,220,0.28)', borderRadius:16, padding:'28px', backdropFilter:'blur(10px)' }}>
                  <p className="abt-eyebrow" style={{ marginBottom:10 }}>The Team</p>
                  <div style={{ width:44, height:3, background:'#1a6be0', borderRadius:2, marginBottom:16 }} />
                  <h2 className="abt-h2" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'clamp(28px,4vw,44px)', textTransform:'uppercase', letterSpacing:'-0.01em', color:'#f0f4ff', lineHeight:1.05 }}>
                    Why Choose Us
                  </h2>
                  <p className="abt-body-text" style={{ fontSize:15, fontWeight:300, lineHeight:1.88, color:'rgba(190,215,255,.80)', marginTop:16 }}>
                    Every member of our team is a genuine car enthusiast. We speak your language, understand what matters to you, and will never rush you into a decision.
                  </p>
                  <p className="abt-body-text" style={{ fontSize:15, fontWeight:300, lineHeight:1.88, color:'rgba(190,215,255,.80)', marginTop:12 }}>
                    Your perfect car exists brand new off the lot or a flawless pre-owned. We'll help you find it, finance it, and love it.
                  </p>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:24 }}>
                    {brands.map(b => (
                      <span key={b} style={{
                        fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10,
                        letterSpacing:'0.14em', textTransform:'uppercase', color:'#c8dcff',
                        background:'rgba(0,69,160,0.40)', border:'1px solid rgba(0,100,220,0.45)',
                        borderRadius:4, padding:'4px 10px',
                      }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal dir="right">
                <div className="abt-img-frame">
                  <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80" alt="Team" loading="lazy" />
                  <div style={{ position:'absolute', bottom:18, left:18, background:'rgba(0,8,30,.90)', border:'1px solid rgba(0,80,200,.50)', borderRadius:8, padding:'10px 16px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.09em', textTransform:'uppercase', color:'#fff', backdropFilter:'blur(8px)', zIndex:2 }}>
                    Since <span style={{ color:'#7ab4ff' }}>2016</span> · Harare, ZW
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </div>

      </div>
    </>
  )
}