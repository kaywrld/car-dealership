import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import bgImage from '../../assets/background.jpg'

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
  const cls = dir === 'left' ? 'ct-reveal-left' : dir === 'right' ? 'ct-reveal-right' : 'ct-reveal'
  return (
    <div ref={ref} className={cls} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    console.log('Form submitted:', form)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const infoItems = [
    { Icon: Phone, label: 'Phone', main: '+263 772 529 318/ +263 716 555 555', sub: 'Mon–Sat, 8am–7pm' },
    { Icon: Mail, label: 'Email', main: 'beemapsy@gmail.com / inquiries@beecars.co.zw', sub: 'We reply within 2 hours' },
    { Icon: MapPin, label: 'Visit Us', main: 'Lot D railway siding, Cnr Robert Mugabe and Grenara', sub: 'Open by in stated hours' },
    { Icon: Clock, label: 'Hours', main: 'Mon–Sat: 8am – 7pm', sub: 'Sunday: 10am – 4pm' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: "'Barlow', sans-serif",
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');

        .contact-input {
          width: 100%;
          background: rgba(0, 30, 90, 0.45);
          border: 1px solid rgba(0, 100, 220, 0.30);
          border-radius: 10px;
          padding: 12px 16px;
          color: #f0f4ff;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }

        .ct-reveal       { opacity:0; transform:translateY(32px); transition:opacity .7s cubic-bezier(.22,.68,0,1.2), transform .7s cubic-bezier(.22,.68,0,1.2); }
        .ct-reveal-left  { opacity:0; transform:translateX(-40px); transition:opacity .75s ease, transform .75s ease; }
        .ct-reveal-right { opacity:0; transform:translateX(40px);  transition:opacity .75s ease, transform .75s ease; }
        .ct-reveal.visible, .ct-reveal-left.visible, .ct-reveal-right.visible { opacity:1; transform:none; }

        .contact-input::placeholder { color: rgba(120, 160, 220, 0.45); }
        .contact-input:focus {
          border-color: rgba(26, 107, 224, 0.75);
          background: rgba(0, 40, 110, 0.55);
        }

        .contact-info-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: rgba(0, 20, 70, 0.55);
          border: 1px solid rgba(0, 80, 200, 0.28);
          border-radius: 14px;
          padding: 18px 20px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s, background 0.2s;
        }
        .contact-info-card:hover {
          border-color: rgba(26, 107, 224, 0.50);
          background: rgba(0, 30, 90, 0.65);
        }

        .contact-submit-btn {
          width: 100%;
          background: #0045a0;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .contact-submit-btn:hover { background: #1a6be0; transform: translateY(-1px); }
        .contact-submit-btn:active { transform: translateY(0) scale(0.99); }
        .contact-submit-btn.sent { background: #0f6e56; }
      `}</style>

      {/* Dark blue gradient overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,15,50,0.78) 0%, rgba(0,40,110,0.70) 40%, rgba(3,9,26,0.92) 100%)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '100px 32px 80px' }}>

        <Reveal>
          {/* ── Page Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 2, background: '#0045a0', borderRadius: 2 }} />
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                letterSpacing: '0.26em', textTransform: 'uppercase', color: '#6fa3e8',
              }}>
                Get In Touch
              </span>
              <div style={{ width: 32, height: 2, background: '#0045a0', borderRadius: 2 }} />
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 68px)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: 16,
            }}>
              Contact{' '}
              <span style={{ color: '#0045a0', WebkitTextStroke: '1.5px #1a6be0', WebkitTextFillColor: 'transparent' }}>
                Us
              </span>
            </h1>

            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 16,
              fontWeight: 300,
              color: 'rgba(200,220,255,0.75)',
              maxWidth: 440,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Our team is ready to help you find the perfect vehicle. Reach out and we'll get back to you promptly.
            </p>
          </div>
        </Reveal>

        {/* ── Main Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}>

          <Reveal dir="left">
            {/* ── Info Panel ── */}
            <div>
              {/* Panel header */}
              <div style={{
                background: 'linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%)',
                border: '1px solid rgba(0, 110, 230, 0.30)',
                borderRadius: '14px 14px 0 0',
                padding: '20px 24px 18px',
                borderBottom: 'none',
              }}>
                <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.35)', borderRadius: 2, marginBottom: 10 }} />
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  textTransform: 'uppercase',
                  color: '#fff',
                  letterSpacing: '0.02em',
                  marginBottom: 4,
                }}>
                  Reach Us Directly
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(200,225,255,0.60)' }}>
                  Multiple ways to connect with our team.
                </p>
              </div>

              {/* Info cards */}
              <div style={{
                background: 'rgba(0, 15, 55, 0.60)',
                border: '1px solid rgba(0, 80, 200, 0.22)',
                borderRadius: '0 0 14px 14px',
                backdropFilter: 'blur(12px)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {infoItems.map(({ Icon, label, main, sub }, i) => (
                  <Reveal key={label} delay={i * 0.08}>
                    <div key={label} className="contact-info-card">
                      <div style={{
                        width: 42, height: 42,
                        borderRadius: 10,
                        background: 'rgba(0, 69, 160, 0.40)',
                        border: '1px solid rgba(26, 107, 224, 0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={17} color="#6fa3e8" />
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 10, fontWeight: 600,
                          letterSpacing: '0.18em', textTransform: 'uppercase',
                          color: 'rgba(111, 163, 232, 0.70)',
                          marginBottom: 3,
                        }}>{label}</p>
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, color: '#f0f4ff', marginBottom: 2 }}>{main}</p>
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(140, 175, 230, 0.55)' }}>{sub}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={0.12}>
            {/* ── Form Panel ── */}
            <div style={{
              background: 'rgba(0, 15, 55, 0.60)',
              border: '1px solid rgba(0, 80, 200, 0.22)',
              borderRadius: 14,
              backdropFilter: 'blur(12px)',
              overflow: 'hidden',
            }}>
              {/* Form header */}
              <div style={{
                background: 'linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%)',
                borderBottom: '1px solid rgba(0, 110, 230, 0.25)',
                padding: '20px 28px 18px',
              }}>
                <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.35)', borderRadius: 2, marginBottom: 10 }} />
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: 22,
                  textTransform: 'uppercase', color: '#fff',
                  letterSpacing: '0.02em', marginBottom: 4,
                }}>Send a Message</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(200,225,255,0.60)' }}>
                  We'll respond within 2 business hours.
                </p>
              </div>

              {/* Fields */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Name + Phone row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Ndlovu' },
                    { id: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+263 77 000 0000' },
                  ].map(({ id, label, type, placeholder }) => (
                    <div key={id}>
                      <label style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: 'rgba(111, 163, 232, 0.75)',
                        display: 'block', marginBottom: 7,
                      }}>{label}</label>
                      <input
                        className="contact-input"
                        type={type}
                        value={form[id]}
                        onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(111, 163, 232, 0.75)',
                    display: 'block', marginBottom: 7,
                  }}>Email Address</label>
                  <input
                    className="contact-input"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tendai@example.com"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(111, 163, 232, 0.75)',
                    display: 'block', marginBottom: 7,
                  }}>Message</label>
                  <textarea
                    className="contact-input"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about the vehicle you're looking for..."
                    required
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Submit */}
                <button
                  className={`contact-submit-btn${sent ? ' sent' : ''}`}
                  onClick={handleSubmit}
                >
                  {sent ? '✓ Message Sent!' : 'Send Message →'}
                </button>

                <p style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 11,
                  color: 'rgba(130, 170, 230, 0.45)',
                  textAlign: 'center',
                  marginTop: -4,
                }}>
                  Your information is kept private and never shared.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  )
}