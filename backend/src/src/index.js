const express = require('express')
const cors = require('cors')
const path = require('path')

// 1. Initialize Environment Variables
// Using path.resolve ensures the bridge file finds the .env in the root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// 2. Import Routes
// Ensure these files exist in src/routes/ and do not have blocking code at the top level
const authRoutes = require('./routes/auth')
const carsRoutes = require('./routes/cars')
const uploadRoutes = require('./routes/upload')

const app = express()

// Passenger handles PORT automatically via process.env.PORT
const PORT = process.env.PORT || 5000

// 3. Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://beecars.co.zw',
  'http://beecars.co.zw',
  'https://www.beecars.co.zw',   // ← already there ✅
  'http://www.beecars.co.zw',    // ← already there ✅
  'https://hiring.beecars.co.zw',
  'http://hiring.beecars.co.zw'
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps) or allowed list
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

// 4. Routes
app.use('/api/auth', authRoutes)
app.use('/api/cars', carsRoutes)
app.use('/api/upload', uploadRoutes)

// Health Check - Helpful for verifying the deployment status
app.get('/api/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  })
})

// Root landing page
app.get('/', (_, res) => {
  res.send('Hiring API is active and database is connected.')
})

// 5. Server Initialization
/**
 * In Phusion Passenger, we must export the app.
 * However, many cPanel environments also require the app to start listening 
 * to complete the 'handshake' and prevent the 90-second timeout.
 */
const server = app.listen(PORT, () => {
  console.log(`ðŸš€ Server listening on port ${PORT}`)
})

// Set a specific timeout for the server (2 minutes)
server.timeout = 120000

// REQUIRED for Phusion Passenger
module.exports = app