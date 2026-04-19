const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     10000,  // ← fail fast after 10 seconds
  typeCast: (field, next) => {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1'
    }
    return next()
  },
})

// Test connection — but don't block app startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected')
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message)
    // Don't crash — just log it
  })

module.exports = pool