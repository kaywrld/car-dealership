const pool   = require('../db')
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
require('dotenv').config()

function makeToken(dealer) {
  return jwt.sign(
    { id: dealer.id, email: dealer.email, name: dealer.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' })

  try {
    const [rows] = await pool.query(
      'SELECT * FROM dealers WHERE email = ?', [email]
    )
    const dealer = rows[0]
    if (!dealer)
      return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, dealer.password)
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' })

    res.json({
      token:  makeToken(dealer),
      dealer: { id: dealer.id, name: dealer.name, email: dealer.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

async function register(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' })

  try {
    const hashed = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO dealers (name, email, password) VALUES (?,?,?)',
      [name, email, hashed]
    )
    const dealer = { id: result.insertId, name, email }
    res.status(201).json({ token: makeToken(dealer), dealer })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Email already registered' })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { login, register }