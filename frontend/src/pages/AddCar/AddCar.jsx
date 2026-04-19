import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Upload, PlusCircle, X, ImagePlus, FolderOpen } from 'lucide-react'
import bgImage from '../../assets/background.jpg'
import { useQueryClient } from '@tanstack/react-query'
import { createCar, uploadImage, QUERY_KEYS } from '../../services/api'

const FIELD = (id, label, type = 'text', placeholder = '', opts = null) => ({ id, label, type, placeholder, opts })

const fields = [
  FIELD('make',         'Make',             'text',   'e.g. Toyota'),
  FIELD('model',        'Model',            'text',   'e.g. Land Cruiser Prado'),
  FIELD('year',         'Year',             'number', '2024'),
  FIELD('price',        'Price ($)',         'number', '45000'),
  FIELD('mileage',      'Mileage (km)',      'number', '15000'),
  FIELD('color',        'Colour',           'text',   'e.g. Pearl White'),
  FIELD('engineSize',   'Engine Size',      'text',   'e.g. 2.8L, 3.0L'),
  FIELD('fuel',         'Fuel Type',        'select', '', ['Petrol', 'Diesel', 'Hybrid', 'Electric']),
  FIELD('transmission', 'Transmission',     'select', '', ['Automatic', 'Manual']),
  FIELD('city',         'City / Location',  'select', '', ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Kadoma', 'Marondera', 'Other']),
  FIELD('type',         'Listing Type',     'select', '', ['sale', 'hire']),
  FIELD('isHybrid',     'Hybrid Vehicle',   'select', '', ['No', 'Yes']),
  FIELD('badge',        'Badge (optional)', 'text',   'e.g. Featured, New In'),
]

const panelWrap = {
  background: 'rgba(0, 15, 55, 0.60)',
  border: '1px solid rgba(0, 80, 200, 0.22)',
  borderRadius: 16,
  backdropFilter: 'blur(14px)',
  overflow: 'hidden',
}

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

export default function AddCar() {
  const { dealer } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', mileage: '',
    color: '', engineSize: '', fuel: 'Petrol', transmission: 'Automatic',
    city: 'Harare', type: 'sale', isHybrid: 'No',
    badge: '', summary: '', details: '', features: [''],
  })

  const [images, setImages] = useState([])
  const [imageInput, setImageInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!dealer) { navigate('/login'); return null }

  const setField = (id, val) => setForm(f => ({ ...f, [id]: val }))

  const addImageUrl = () => {
    const url = imageInput.trim()
    if (!url) return
    setImages(prev => [...prev, { src: url, name: url.split('/').pop().slice(0, 30), isLocal: false }])
    setImageInput('')
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, { src: ev.target.result, name: file.name, isLocal: true, file }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i))

  const addFeature    = () => setForm(f => ({ ...f, features: [...f.features, ''] }))
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  const updateFeature = (i, val) => setForm(f => ({
    ...f, features: f.features.map((feat, idx) => idx === i ? val : feat)
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
  
    if (images.length === 0) {
      setError('Please add at least one photo.')
      return
    }
  
    setSubmitting(true)
    try {
      // Upload local files first, get back URLs
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.isLocal) {
            return await uploadImage(img.src, img.name)  // ← upload, get URL back
          }
          return img.src  // already a URL
        })
      )
  
      await createCar({
        ...form,
        year:        Number(form.year),
        price:       Number(form.price),
        mileage:     Number(form.mileage),
        is_hybrid:   form.isHybrid === 'Yes',
        engine_size: form.engineSize,
        image_url:   imageUrls[0],
        images:      imageUrls,
        features:    form.features.filter(f => f.trim() !== ''),
      })
  
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.carsSale })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.carsHire })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to publish listing.')
    } finally {
      setSubmitting(false)
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
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap');

        .ac-input {
          width: 100%;
          background: rgba(0, 20, 70, 0.50);
          border: 1px solid rgba(0, 100, 220, 0.28);
          border-radius: 10px;
          padding: 12px 14px;
          color: #f0f4ff;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .ac-input::placeholder { color: rgba(120, 160, 220, 0.38); }
        .ac-input:focus {
          border-color: rgba(26, 107, 224, 0.75);
          background: rgba(0, 35, 100, 0.60);
        }
        .ac-input option { background: #001a5e; color: #f0f4ff; }

        .ac-label {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(111, 163, 232, 0.75);
          display: block; margin-bottom: 7px;
        }

        .ac-add-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0, 69, 160, 0.55);
          border: 1px solid rgba(26, 107, 224, 0.40);
          color: #a8c8f8;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 0.10em; text-transform: uppercase;
          padding: 8px 16px; border-radius: 8px;
          cursor: pointer; transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .ac-add-btn:hover { background: rgba(26, 107, 224, 0.55); color: #fff; }

        .ac-remove-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(100, 140, 210, 0.45);
          display: flex; align-items: center;
          padding: 6px; border-radius: 6px;
          transition: color 0.2s, background 0.2s; flex-shrink: 0;
        }
        .ac-remove-btn:hover { color: #f08080; background: rgba(200, 60, 60, 0.15); }

        .ac-submit-btn {
          flex: 1;
          background: linear-gradient(135deg, #001a5e 0%, #0045a0 55%, #002f70 100%);
          border: 1px solid rgba(26, 107, 224, 0.40);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; letter-spacing: 0.10em;
          text-transform: uppercase; font-size: 16px;
          padding: 16px 28px; border-radius: 12px;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ac-submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .ac-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .ac-cancel-btn {
          background: rgba(0, 20, 70, 0.45);
          border: 1px solid rgba(0, 80, 200, 0.28);
          color: rgba(160, 200, 255, 0.70);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; font-size: 14px;
          padding: 16px 28px; border-radius: 12px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ac-cancel-btn:hover {
          border-color: rgba(26, 107, 224, 0.55);
          color: #fff; background: rgba(0, 40, 110, 0.55);
        }

        .upload-zone {
          border: 2px dashed rgba(0, 100, 220, 0.35);
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(0, 20, 70, 0.25);
          position: relative;
        }
        .upload-zone:hover {
          border-color: rgba(26, 107, 224, 0.65);
          background: rgba(0, 35, 100, 0.35);
        }
        .upload-zone input[type=file] {
          position: absolute; inset: 0;
          opacity: 0; cursor: pointer; width: 100%; height: 100%;
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
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: 'clamp(38px, 6vw, 58px)',
            lineHeight: 1, letterSpacing: '-0.01em',
            textTransform: 'uppercase', color: '#fff', marginBottom: 10,
          }}>
            Add a{' '}
            <span style={{ color: '#0045a0', WebkitTextStroke: '1.5px #1a6be0', WebkitTextFillColor: 'transparent' }}>
              New Car
            </span>
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(140, 175, 230, 0.55)' }}>
            Logged in as {dealer.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Vehicle Details */}
          <div style={panelWrap}>
            <PanelHeader title="Vehicle Details" subtitle="Fill in the core specs for this listing" />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {fields.map(({ id, label, type, placeholder, opts }) => (
                  <div key={id}>
                    <label className="ac-label">{label}</label>
                    {type === 'select' ? (
                      <select className="ac-input" value={form[id]} onChange={e => setField(id, e.target.value)}>
                        {opts.map(o => (
                          <option key={o} value={o}>
                            {o === 'sale' ? 'For Sale' : o === 'hire' ? 'For Hire' : o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="ac-input" type={type}
                        value={form[id]} onChange={e => setField(id, e.target.value)}
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div style={panelWrap}>
            <PanelHeader title="Photos" subtitle="First image is the cover. Add from URL or upload from your computer." />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Image count indicator */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 12,
                  color: images.length > 0 ? 'rgba(160,220,160,0.85)' : 'rgba(111,163,232,0.50)',
                }}>
                  {images.length === 0
                    ? 'No photos added yet'
                    : `${images.length} photo${images.length > 1 ? 's' : ''} added — first is the cover`}
                </span>
              </div>

              {/* URL input row */}
              <div>
                <label className="ac-label">Add by URL</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="ac-input"
                    type="url"
                    value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    placeholder="Paste image URL then press Enter or click Add…"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="ac-add-btn" onClick={addImageUrl}>
                    <ImagePlus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Local file upload zone */}
              <div>
                <label className="ac-label">Upload from computer</label>
                <div className="upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <FolderOpen size={28} color="rgba(111,163,232,0.55)" style={{ margin: '0 auto 10px' }} />
                  <p style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 14,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'rgba(160, 200, 255, 0.70)',
                  }}>
                    Click to browse or drag & drop
                  </p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(111,163,232,0.40)', marginTop: 4 }}>
                    JPG, PNG, WEBP — select multiple files at once
                  </p>
                </div>
              </div>

              {/* Image preview grid */}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{
                      position: 'relative', borderRadius: 10, overflow: 'hidden',
                      border: i === 0 ? '2px solid rgba(26, 107, 224, 0.70)' : '1px solid rgba(0, 80, 200, 0.30)',
                    }}>
                      <img
                        src={img.src} alt={`Photo ${i + 1}`}
                        style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                      />
                      <span style={{
                        position: 'absolute', top: 6, left: 6,
                        background: i === 0 ? 'rgba(0,69,160,0.90)' : 'rgba(0,10,40,0.80)',
                        color: '#6fa3e8',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700, fontSize: 10, letterSpacing: '0.10em',
                        textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20,
                      }}>
                        {i === 0 ? 'Cover' : img.isLocal ? `Local #${i + 1}` : `#${i + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: 6, right: 6,
                          background: 'rgba(0,10,40,0.80)', border: 'none',
                          color: '#f08080', borderRadius: '50%',
                          width: 24, height: 24,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,40,40,0.80)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,10,40,0.80)'}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div style={panelWrap}>
            <PanelHeader title="Descriptions" subtitle="Short summary for the card, full details for the modal" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ac-label">Short Summary (shown on card)</label>
                <input
                  className="ac-input" type="text" value={form.summary}
                  onChange={e => setField('summary', e.target.value)}
                  placeholder="One punchy sentence about the car…"
                  required
                />
              </div>
              <div>
                <label className="ac-label">Full Details (shown in modal)</label>
                <textarea
                  className="ac-input" rows={6} value={form.details}
                  onChange={e => setField('details', e.target.value)}
                  placeholder="Describe the car fully — spec, condition, history, modifications…"
                  style={{ resize: 'none' }} required
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
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
                    <input
                      className="ac-input" type="text" value={feat}
                      onChange={e => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}, e.g. Panoramic Roof`}
                      style={{ flex: 1 }}
                    />
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

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(160, 30, 30, 0.25)',
              border: '1px solid rgba(220, 60, 60, 0.35)',
              borderRadius: 10, padding: '14px 20px',
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#f08080',
            }}>
              {error}
            </div>
          )}

          {/* Submit Row */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="submit" className="ac-submit-btn" disabled={submitting}>
              <Upload size={16} />
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
            <button type="button" className="ac-cancel-btn" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}