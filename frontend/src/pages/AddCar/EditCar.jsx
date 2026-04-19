import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Upload, PlusCircle, X, ImagePlus, FolderOpen, CheckCircle, XCircle } from 'lucide-react'
import bgImage from '../../assets/background.jpg'
import { updateCar, uploadImage } from '../../services/api'

const panelWrap = {
  background: 'rgba(0, 15, 55, 0.60)',
  border: '1px solid rgba(0, 80, 200, 0.22)',
  borderRadius: 16,
  backdropFilter: 'blur(14px)',
  overflow: 'hidden',
}

const API = import.meta.env.VITE_API_URL

const PanelHeader = ({ title, subtitle }) => (
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
      letterSpacing: '0.04em', marginBottom: subtitle ? 4 : 0,
    }}>{title}</p>
    {subtitle && (
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(200,225,255,0.55)' }}>{subtitle}</p>
    )}
  </div>
)

const selectFields = [
  { id: 'fuel',         label: 'Fuel Type',       opts: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
  { id: 'transmission', label: 'Transmission',     opts: ['Automatic', 'Manual'] },
  { id: 'city',         label: 'City / Location',  opts: ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Kadoma', 'Marondera', 'Other'] },
  { id: 'type',         label: 'Listing Type',     opts: ['sale', 'hire'] },
  { id: 'isHybrid',     label: 'Hybrid Vehicle',   opts: ['No', 'Yes'] },
]

const textFields = [
  { id: 'make',       label: 'Make',            type: 'text',   ph: 'e.g. Toyota' },
  { id: 'model',      label: 'Model',           type: 'text',   ph: 'e.g. Land Cruiser' },
  { id: 'year',       label: 'Year',            type: 'number', ph: '2024' },
  { id: 'price',      label: 'Price ($)',        type: 'number', ph: '45000' },
  { id: 'mileage',    label: 'Mileage (km)',     type: 'number', ph: '15000' },
  { id: 'color',      label: 'Colour',          type: 'text',   ph: 'e.g. Pearl White' },
  { id: 'engineSize', label: 'Engine Size',     type: 'text',   ph: 'e.g. 2.8L' },
  { id: 'badge',      label: 'Badge (optional)', type: 'text',  ph: 'e.g. Featured' },
]

export default function EditCar() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { dealer } = useAuth()

  const [form, setForm]             = useState(null)
  const [images, setImages]         = useState([])
  const [imageInput, setImageInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    if (!dealer) navigate('/login')
  }, [dealer])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cars/${id}`)
      .then(r => r.json())
      .then(car => {
        setForm({
          make:         car.make         || '',
          model:        car.model        || '',
          year:         car.year         || '',
          price:        car.price        || '',
          mileage:      car.mileage      || '',
          color:        car.color        || '',
          engineSize:   car.engine_size  || '',
          fuel:         car.fuel         || 'Petrol',
          transmission: car.transmission || 'Automatic',
          city:         car.city         || 'Harare',
          type:         car.type         || 'sale',
          isHybrid:     car.is_hybrid    ? 'Yes' : 'No',
          badge:        car.badge        || '',
          summary:      car.summary      || '',
          details:      car.details      || '',
          sold:         car.sold         || false,   // ← availability status
          features:     Array.isArray(car.features) && car.features.length > 0
                          ? car.features : [''],
        })
        const existingImgs =
          Array.isArray(car.images) && car.images.length > 0 ? car.images
          : car.image_url ? [car.image_url]
          : []
        setImages(existingImgs.map(src => ({ src, name: src.slice(0, 40), isLocal: false })))
      })
      .catch(() => setError('Failed to load car data.'))
  }, [id])

  if (!form) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#03091a', color: '#6fa3e8',
      fontFamily: "'Barlow', sans-serif", fontSize: 14,
    }}>
      {error || 'Loading...'}
    </div>
  )

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ── Images ──
  const addImageUrl = () => {
    const url = imageInput.trim()
    if (!url) return
    setImages(prev => [...prev, { src: url, name: url.split('/').pop().slice(0, 30), isLocal: false }])
    setImageInput('')
  }

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, { src: ev.target.result, name: file.name, isLocal: true }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i))

  // ── Features ──
  const addFeature    = () => setForm(f => ({ ...f, features: [...f.features, ''] }))
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  const updateFeature = (i, val) => setForm(f => ({
    ...f, features: f.features.map((feat, idx) => idx === i ? val : feat)
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Upload any new local files first
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.isLocal) {
            return await uploadImage(img.src, img.name)
          }
          return img.src
        })
      )

      await updateCar(id, {
        ...form,
        year:        Number(form.year),
        price:       Number(form.price),
        mileage:     Number(form.mileage),
        is_hybrid:   form.isHybrid === 'Yes',
        engine_size: form.engineSize,
        city:        form.city,
        sold:        form.sold,
        features:    form.features.filter(f => f.trim() !== ''),
        image_url:   imageUrls[0] || null,
        images:      imageUrls,
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to save changes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      fontFamily: "'Barlow', sans-serif", position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');
        .ac-input {
          width: 100%; background: rgba(0,20,70,0.50);
          border: 1px solid rgba(0,100,220,0.28); border-radius: 10px;
          padding: 12px 14px; color: #f0f4ff;
          font-family: 'Barlow', sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box;
        }
        .ac-input::placeholder { color: rgba(120,160,220,0.38); }
        .ac-input:focus { border-color: rgba(26,107,224,0.75); background: rgba(0,35,100,0.60); }
        .ac-input option { background: #001a5e; color: #f0f4ff; }
        .ac-label {
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(111,163,232,0.75); display: block; margin-bottom: 7px;
        }
        .ac-add-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,69,160,0.55); border: 1px solid rgba(26,107,224,0.40);
          color: #a8c8f8; font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
          transition: background 0.2s, color 0.2s; white-space: nowrap;
        }
        .ac-add-btn:hover { background: rgba(26,107,224,0.55); color: #fff; }
        .ac-remove-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(100,140,210,0.45); display: flex; align-items: center;
          padding: 6px; border-radius: 6px;
          transition: color 0.2s, background 0.2s; flex-shrink: 0;
        }
        .ac-remove-btn:hover { color: #f08080; background: rgba(200,60,60,0.15); }
        .upload-zone {
          border: 2px dashed rgba(0,100,220,0.35); border-radius: 12px;
          padding: 24px 20px; text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(0,20,70,0.25); position: relative;
        }
        .upload-zone:hover { border-color: rgba(26,107,224,0.65); background: rgba(0,35,100,0.35); }
        .upload-zone input[type=file] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .status-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
          font-size: 15px; letter-spacing: 0.10em; text-transform: uppercase;
          padding: 18px 20px; border-radius: 12px; cursor: pointer;
          transition: all 0.2s; border: 2px solid transparent;
        }
      `}</style>

      {/* Overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,15,50,0.78) 0%, rgba(0,40,110,0.70) 40%, rgba(3,9,26,0.92) 100%)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', padding: '100px 28px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2, background: '#0045a0', borderRadius: 2 }} />
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.26em', textTransform: 'uppercase', color: '#6fa3e8',
            }}>Dealer Dashboard</span>
            <div style={{ width: 28, height: 2, background: '#0045a0', borderRadius: 2 }} />
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
            fontSize: 'clamp(38px, 6vw, 58px)', lineHeight: 1,
            textTransform: 'uppercase', color: '#fff', marginBottom: 10,
          }}>
            Edit{' '}
            <span style={{ color: '#0045a0', WebkitTextStroke: '1.5px #1a6be0', WebkitTextFillColor: 'transparent' }}>
              Listing
            </span>
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(140,175,230,0.55)' }}>
            Logged in as {dealer?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── AVAILABILITY STATUS ── */}
          <div style={panelWrap}>
            <PanelHeader title="Listing Status" subtitle="Control what buyers see on the card" />
            <div style={{ padding: '24px 28px' }}>
              <label className="ac-label" style={{ marginBottom: 14 }}>Current Status</label>
              <div style={{ display: 'flex', gap: 12 }}>

                {/* Available button */}
                <button
                  type="button"
                  className="status-btn"
                  onClick={() => setField('sold', false)}
                  style={{
                    background: !form.sold ? 'rgba(0, 120, 60, 0.30)' : 'rgba(0,20,70,0.40)',
                    borderColor: !form.sold ? 'rgba(46, 204, 113, 0.70)' : 'rgba(0,80,200,0.25)',
                    color: !form.sold ? '#2ecc71' : 'rgba(160,200,255,0.45)',
                  }}
                >
                  <CheckCircle size={18} />
                  Available
                </button>

                {/* Sold Out button */}
                <button
                  type="button"
                  className="status-btn"
                  onClick={() => setField('sold', true)}
                  style={{
                    background: form.sold ? 'rgba(160, 30, 30, 0.30)' : 'rgba(0,20,70,0.40)',
                    borderColor: form.sold ? 'rgba(231, 76, 60, 0.70)' : 'rgba(0,80,200,0.25)',
                    color: form.sold ? '#e74c3c' : 'rgba(160,200,255,0.45)',
                  }}
                >
                  <XCircle size={18} />
                  Sold Out
                </button>
              </div>

              {/* Live preview of badge */}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 11,
                  color: 'rgba(160,200,255,0.50)',
                }}>Badge preview:</span>
                <span style={{
                  display: 'inline-block',
                  background: form.sold ? '#e74c3c' : '#2ecc71',
                  color: '#fff',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: 10, letterSpacing: '0.14em',
                  textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20,
                }}>
                  {form.sold ? 'SOLD OUT' : 'AVAILABLE'}
                </span>
              </div>
            </div>
          </div>

          {/* ── VEHICLE DETAILS ── */}
          <div style={panelWrap}>
            <PanelHeader title="Vehicle Details" subtitle="Update the core specs" />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {textFields.map(({ id: fid, label, type, ph }) => (
                  <div key={fid}>
                    <label className="ac-label">{label}</label>
                    <input
                      className="ac-input" type={type}
                      value={form[fid] ?? ''}
                      onChange={e => setField(fid, e.target.value)}
                      placeholder={ph}
                    />
                  </div>
                ))}
                {selectFields.map(({ id: fid, label, opts }) => (
                  <div key={fid}>
                    <label className="ac-label">{label}</label>
                    <select
                      className="ac-input"
                      value={form[fid] ?? ''}
                      onChange={e => setField(fid, e.target.value)}
                    >
                      {opts.map(o => (
                        <option key={o} value={o}>
                          {o === 'sale' ? 'For Sale' : o === 'hire' ? 'For Hire' : o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PHOTOS ── */}
          <div style={panelWrap}>
            <PanelHeader title="Photos" subtitle="First image is the cover — drag to reorder coming soon" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <label className="ac-label">Add by URL</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="ac-input" type="url" value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    placeholder="Paste image URL then press Enter…"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="ac-add-btn" onClick={addImageUrl}>
                    <ImagePlus size={14} /> Add
                  </button>
                </div>
              </div>

              <div>
                <label className="ac-label">Upload from computer</label>
                <div className="upload-zone">
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                  <FolderOpen size={26} color="rgba(111,163,232,0.55)" style={{ margin: '0 auto 10px' }} />
                  <p style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                    fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'rgba(160,200,255,0.70)',
                  }}>Click to browse or drag & drop</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(111,163,232,0.40)', marginTop: 4 }}>
                    JPG, PNG, WEBP — multiple files supported
                  </p>
                </div>
              </div>

              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{
                      position: 'relative', borderRadius: 10, overflow: 'hidden',
                      border: i === 0 ? '2px solid rgba(26,107,224,0.70)' : '1px solid rgba(0,80,200,0.30)',
                    }}>
                      <img src={img.src} alt={`Photo ${i + 1}`}
                        style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                      <span style={{
                        position: 'absolute', top: 6, left: 6,
                        background: i === 0 ? 'rgba(0,69,160,0.90)' : 'rgba(0,10,40,0.80)',
                        color: '#6fa3e8', fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700, fontSize: 10, textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 20,
                      }}>
                        {i === 0 ? 'Cover' : `#${i + 1}`}
                      </span>
                      <button type="button" onClick={() => removeImage(i)} style={{
                        position: 'absolute', top: 6, right: 6,
                        background: 'rgba(0,10,40,0.80)', border: 'none',
                        color: '#f08080', borderRadius: '50%',
                        width: 24, height: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── DESCRIPTIONS ── */}
          <div style={panelWrap}>
            <PanelHeader title="Descriptions" subtitle="Short summary for the card, full details for the modal" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ac-label">Short Summary (shown on card)</label>
                <input className="ac-input" type="text" value={form.summary}
                  onChange={e => setField('summary', e.target.value)}
                  placeholder="One punchy sentence…" required />
              </div>
              <div>
                <label className="ac-label">Full Details (shown in modal)</label>
                <textarea className="ac-input" rows={6} value={form.details}
                  onChange={e => setField('details', e.target.value)}
                  style={{ resize: 'none' }} required />
              </div>
            </div>
          </div>

          {/* ── KEY FEATURES ── */}
          <div style={panelWrap}>
            <PanelHeader title="Key Features" subtitle="Highlights shown in the car detail view" />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                <button type="button" className="ac-add-btn" onClick={addFeature}>
                  <PlusCircle size={14} /> Add Feature
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {form.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input className="ac-input" type="text" value={feat}
                      onChange={e => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}, e.g. Panoramic Roof`}
                      style={{ flex: 1 }} />
                    {form.features.length > 1 && (
                      <button type="button" className="ac-remove-btn" onClick={() => removeFeature(i)}>
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(160,30,30,0.25)', border: '1px solid rgba(220,60,60,0.35)',
              borderRadius: 10, padding: '14px 20px',
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#f08080',
            }}>
              {error}
            </div>
          )}

          {/* Submit row */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1,
              background: submitting ? 'rgba(0,30,80,0.60)' : 'linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%)',
              border: '1px solid rgba(26,107,224,0.40)', color: '#fff',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              letterSpacing: '0.10em', textTransform: 'uppercase', fontSize: 16,
              padding: '16px 28px', borderRadius: 12, cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: submitting ? 0.5 : 1, transition: 'opacity 0.2s',
            }}>
              <Upload size={16} />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/')} style={{
              background: 'rgba(0,20,70,0.45)',
              border: '1px solid rgba(0,80,200,0.28)',
              color: 'rgba(160,200,255,0.70)',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              textTransform: 'uppercase', fontSize: 14,
              padding: '16px 28px', borderRadius: 12, cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}