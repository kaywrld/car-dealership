const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function protect(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorised — no token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.dealer = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Not authorised — invalid token' })
  }
}