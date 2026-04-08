import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import CarCard from '../../components/cars/CarCard'
import CarModal from '../../components/cars/CarModal'
import { fetchCars, deleteCar, QUERY_KEYS } from '../../services/api'

export default function CarsForSale({ filterMake = '' }) {
  const [selectedCar, setSelectedCar] = useState(null)
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  const { data: cars = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.carsSale,
    queryFn:  () => fetchCars('sale'),
  })

  const handleEdit = (car) => navigate(`/edit-car/${car.id}`)

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this car from listings?')) return
    try {
      await deleteCar(id)
      // Update cache instantly — no refetch needed
      queryClient.setQueryData(QUERY_KEYS.carsSale, (old) =>
        old ? old.filter(c => c.id !== id) : []
      )
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const filtered = filterMake
    ? cars.filter(c => c.make?.toLowerCase() === filterMake.toLowerCase())
    : cars

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", color: '#6080b0', fontSize: 14 }}>
      Loading vehicles...
    </div>
  )
  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", color: '#c0392b', fontSize: 14 }}>
      {error.message}
    </div>
  )
  if (!filtered.length) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", color: '#6080b0', fontSize: 14 }}>
      {filterMake ? `No "${filterMake}" cars for sale.` : 'No cars for sale right now.'}
    </div>
  )

  return (
    <section>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
        {filtered.map((car, i) => (
          <div key={car.id} style={{
            animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
            animationDelay: `${i * 60}ms`, opacity: 0,
          }}>
            <CarCard car={car} onShowMore={setSelectedCar} onEdit={handleEdit} onDelete={handleDelete} isHire={false} />
          </div>
        ))}
      </div>
      {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} isHire={false} onShowMore={setSelectedCar} />}
    </section>
  )
}