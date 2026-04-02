import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarCard from '../../components/cars/CarCard'
import CarModal from '../../components/cars/CarModal'
import { fetchCars, deleteCar } from '../../services/api'

export default function CarsForHire({ filterMake = '' }) {
  const [cars, setCars]               = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCars('hire')
      .then(setCars)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const displayed = filterMake
    ? cars.filter(c => c.make === filterMake)
    : cars

  const handleEdit   = (car) => navigate(`/edit-car/${car.id}`)

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this car from listings?')) return
    try {
      await deleteCar(id)
      setCars(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (loading) return (
    <p style={{ fontFamily: "'Barlow', sans-serif", color: '#6080b0', fontSize: 14, padding: '40px 0' }}>
      Loading vehicles...
    </p>
  )
  if (error) return (
    <p style={{ fontFamily: "'Barlow', sans-serif", color: '#c0392b', fontSize: 14, padding: '40px 0' }}>
      {error}
    </p>
  )
  if (!cars.length) return (
    <p style={{ fontFamily: "'Barlow', sans-serif", color: '#FFFF', fontSize: 14, padding: '40px 0' }}>
      No hire cars available right now.
    </p>
  )

  return (
    <section>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: 24,
      }}>
        {displayed.map((car, i) => (
          <div
            key={car.id}
            style={{
              animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
              animationDelay: `${i * 70}ms`,
              opacity: 0,
            }}
          >
            <CarCard
              car={car}
              onShowMore={setSelectedCar}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isHire={true}
            />
          </div>
        ))}
      </div>

      {!displayed.length && (
        <p style={{ fontFamily: "'Barlow', sans-serif", color: '#6080b0', fontSize: 14, padding: '40px 0' }}>
          No hire cars match that filter.
        </p>
      )}

      {selectedCar && (
        <CarModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          isHire={true}
        />
      )}
    </section>
  )
}