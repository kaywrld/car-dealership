const mysql  = require('mysql2/promise')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Convert TINYINT(1) to boolean automatically
  typeCast: (field, next) => {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1'
    }
    return next()
  },
})

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected')
    conn.release()
  })
  .catch(err => console.error('❌ MySQL connection error:', err.message))

module.exports = pool