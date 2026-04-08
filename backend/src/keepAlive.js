const https = require('https')
const http  = require('http')

const RENDER_URL = process.env.RENDER_URL || ''
const INTERVAL   = 14 * 60 * 1000  // ping every 14 minutes

function ping() {
  if (!RENDER_URL) return

  const url      = new URL(`${RENDER_URL}/api/health`)
  const client   = url.protocol === 'https:' ? https : http

  const req = client.get(url.toString(), (res) => {
    console.log(`[keep-alive] ping → ${res.statusCode} at ${new Date().toISOString()}`)
  })

  req.on('error', (err) => {
    console.warn('[keep-alive] ping failed:', err.message)
  })

  req.end()
}

function startKeepAlive() {
  if (!RENDER_URL) {
    console.log('[keep-alive] RENDER_URL not set — skipping (local mode)')
    return
  }
  console.log(`[keep-alive] pinging ${RENDER_URL} every 14 minutes`)
  ping() // ping immediately on startup
  setInterval(ping, INTERVAL)
}

module.exports = { startKeepAlive }