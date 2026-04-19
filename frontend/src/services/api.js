const BASE = `${import.meta.env.VITE_API_URL}/api`

export const QUERY_KEYS = {
  carsSale: ['cars', 'sale'],
  carsHire: ['cars', 'hire'],
  carById:  (id) => ['cars', id],
}

function getToken() {
  return localStorage.getItem('ae_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// ── Auth ────────────────────────────────────────────────
export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data   // { token, dealer }
}

// ── Cars ────────────────────────────────────────────────
export async function fetchCars(type = '') {
  const url = type ? `${BASE}/cars?type=${type}` : `${BASE}/cars`
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function createCar(carData) {
  const res = await fetch(`${BASE}/cars`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(carData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function updateCar(id, carData) {
  const res = await fetch(`${BASE}/cars/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(carData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function deleteCar(id) {
  const res = await fetch(`${BASE}/cars/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

// ── Image Upload ─────────────────────────────────────────
export async function uploadImage(base64, filename) {
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ base64, filename }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.url  // returns the public https:// URL
}

export async function fetchMakes() {
    const res = await fetch(`${BASE}/cars/makes`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }