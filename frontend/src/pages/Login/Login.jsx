import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Car, Eye, EyeOff } from 'lucide-react'
import bgImage from '../../assets/background.jpg'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/add-car')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: "'Barlow', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');

        .login-input {
          width: 100%;
          background: rgba(0, 30, 90, 0.45);
          border: 1px solid rgba(0, 100, 220, 0.30);
          border-radius: 10px;
          padding: 13px 16px;
          color: #f0f4ff;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: rgba(120, 160, 220, 0.40); }
        .login-input:focus {
          border-color: rgba(26, 107, 224, 0.75);
          background: rgba(0, 40, 110, 0.55);
        }

        .login-btn {
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
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
        }
        .login-btn:hover:not(:disabled) { background: #1a6be0; transform: translateY(-1px); }
        .login-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .login-btn:disabled { opacity: 0.50; cursor: not-allowed; }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(111, 163, 232, 0.50);
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #6fa3e8; }
      `}</style>

      {/* Dark blue gradient overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,15,50,0.78) 0%, rgba(0,40,110,0.70) 40%, rgba(3,9,26,0.92) 100%)',
        zIndex: 0,
      }} />

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>

          {/* Logo icon */}
          <div style={{
            width: 56, height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0045a0, #1a6be0)',
            border: '1px solid rgba(26, 107, 224, 0.50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Car size={24} color="#fff" />
          </div>

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2, background: '#0045a0', borderRadius: 2 }} />
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.26em', textTransform: 'uppercase', color: '#6fa3e8',
            }}>
              Dealer Portal
            </span>
            <div style={{ width: 28, height: 2, background: '#0045a0', borderRadius: 2 }} />
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(34px, 6vw, 48px)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: 10,
          }}>
            Welcome{' '}
            <span style={{ color: '#0045a0', WebkitTextStroke: '1.5px #1a6be0', WebkitTextFillColor: 'transparent' }}>
              Back
            </span>
          </h1>

          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14, fontWeight: 300,
            color: 'rgba(200,220,255,0.60)',
            lineHeight: 1.6,
          }}>
            Sign in to manage your inventory
          </p>
        </div>

        {/* ── Form Panel ── */}
        <div style={{
          background: 'rgba(0, 15, 55, 0.60)',
          border: '1px solid rgba(0, 80, 200, 0.22)',
          borderRadius: 16,
          backdropFilter: 'blur(14px)',
          overflow: 'hidden',
        }}>

          {/* Panel header bar */}
          <div style={{
            background: 'linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%)',
            borderBottom: '1px solid rgba(0, 110, 230, 0.25)',
            padding: '18px 28px',
          }}>
            <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.35)', borderRadius: 2, marginBottom: 8 }} />
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: 18,
              textTransform: 'uppercase', color: '#fff',
              letterSpacing: '0.04em',
            }}>Sign In to Your Account</p>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

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
                className="login-input"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@beecars.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(111, 163, 232, 0.75)',
                display: 'block', marginBottom: 7,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(160, 30, 30, 0.25)',
                border: '1px solid rgba(220, 60, 60, 0.35)',
                borderRadius: 10,
                padding: '12px 16px',
                fontFamily: "'Barlow', sans-serif",
                fontSize: 13,
                color: '#f08080',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>

            {/* Test credentials hint */}
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: 'rgba(130, 170, 230, 0.38)',
              textAlign: 'center',
              marginTop: -4,
            }}>
              Test: dealer@BeeCars.com / admin123
            </p>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/" style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: 'rgba(111, 163, 232, 0.50)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#6fa3e8'}
            onMouseLeave={e => e.target.style.color = 'rgba(111, 163, 232, 0.50)'}
          >
            ← Back to listings
          </Link>
        </div>

      </div>
    </div>
  )
}