const CACHE = 'beecars-v2'  // bumped version forces old SW out

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(['/', '/index.html']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Only handle GET over http/https
  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // API / Render — network only, no caching (React Query handles this)
  if (
    url.hostname.includes('onrender.com') ||
    url.pathname.startsWith('/api')
  ) {
    return  // let browser handle it normally
  }

  // Static hashed assets (Vite outputs filename hashes) — cache forever
  if (url.pathname.match(/\/assets\/.+\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)$/)) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response
          }
          const copy = response.clone()
          caches.open(CACHE).then(c => c.put(request, copy))
          return response
        })
      })
    )
    return
  }

  // Everything else (HTML, navigation) — network first, fall back to index.html
  e.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response
        }
        const copy = response.clone()
        caches.open(CACHE).then(c => c.put(request, copy))
        return response
      })
      .catch(() => caches.match('/index.html'))
  )
})