const CACHE = 'beecars-v1'

const PRECACHE = [
  '/',
  '/index.html',
]

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch strategy:
// - JS/CSS/fonts/images → Cache First (serve from cache, update in background)
// - API calls → Network First (always try network, fall back to cache)
// - HTML → Network First (always get fresh HTML)
self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  // API calls — network first
  if (url.pathname.startsWith('/api') || url.hostname.includes('onrender.com')) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
          return res
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets (JS, CSS, images, fonts) — cache first
  if (
    url.pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)$/)
  ) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          // Update cache in background
          fetch(request).then(res => {
            caches.open(CACHE).then(c => c.put(request, res))
          }).catch(() => {})
          return cached
        }
        return fetch(request).then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()))
          return res
        })
      })
    )
    return
  }

  // HTML / navigation — network first, fall back to index.html
  e.respondWith(
    fetch(request)
      .then(res => {
        caches.open(CACHE).then(c => c.put(request, res.clone()))
        return res
      })
      .catch(() =>
        caches.match('/index.html')
      )
  )
})