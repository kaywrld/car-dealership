const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const carsRoutes = require('./routes/cars')
const { startKeepAlive } = require('./keepAlive')

const app  = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.beecars.co.zw',   // ← replace with your real cPanel domain
  'https://beecars.co.zw',
  'http://www.beecars.co.zw',   // ← replace with your real cPanel domain
  'http://beecars.co.zw',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/cars', carsRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

startKeepAlive()