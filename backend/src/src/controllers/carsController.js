const pool = require('../db')
const fs   = require('fs')
const path = require('path')

// From src/controllers/ → ../../../ → /home/beecars3/ → public_html/uploads
const UPLOAD_DIR = '/home/beecars3/public_html/uploads'

// Helper — parse JSON fields coming out of MySQL
function parseCar(car) {
  if (!car) return car
  return {
    ...car,
    images:    safeParseJSON(car.images,   []),
    features:  safeParseJSON(car.features, []),
    sold:      Boolean(car.sold),
    is_hybrid: Boolean(car.is_hybrid),
  }
}

function safeParseJSON(val, fallback) {
  if (Array.isArray(val)) return val
  if (!val) return fallback
  try { return JSON.parse(val) } catch { return fallback }
}

// GET /api/cars?type=sale|hire
async function getCars(req, res) {
  try {
    const { type } = req.query

    let sql      = 'SELECT * FROM cars WHERE sold = 0'
    const params = []
    if (type === 'sale' || type === 'hire') {
      sql += ' AND type = ?'
      params.push(type)
    }
    sql += ' ORDER BY created_at DESC'
    const [rows] = await pool.query(sql, params)
    res.json(rows.map(parseCar))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/cars/makes
async function getMakes(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT make FROM cars WHERE sold = 0 ORDER BY make ASC'
    )
    res.json(rows.map(r => r.make))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/cars/:id
async function getCarById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Car not found' })
    res.json(parseCar(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/cars
async function createCar(req, res) {
  const {
    type, make, model, year, price, price_unit,
    mileage, fuel, transmission, color, badge,
    image_url, images, summary, details, features,
    engine_size, city, is_hybrid, sold
  } = req.body

  if (!type || !make || !model || !year || !price || !summary || !details) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO cars
        (type, make, model, year, price, price_unit, mileage, fuel,
         transmission, color, badge, image_url, images, summary, details,
         features, engine_size, city, is_hybrid, sold)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        type, make, model, year, price,
        price_unit  || null,
        mileage, fuel, transmission, color,
        badge       || null,
        image_url   || null,
        JSON.stringify(Array.isArray(images)   ? images   : []),
        summary, details,
        JSON.stringify(Array.isArray(features) ? features : []),
        engine_size || null,
        city        || null,
        is_hybrid   ? 1 : 0,
        sold        ? 1 : 0,
      ]
    )
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [result.insertId])
    res.status(201).json(parseCar(rows[0]))
  } catch (err) {
    console.error('CREATE CAR ERROR:', err)
    res.status(500).json({ error: err.message, code: err.code })
  }
}

// PUT /api/cars/:id
async function updateCar(req, res) {
  const {
    type, make, model, year, price, price_unit,
    mileage, fuel, transmission, color, badge,
    image_url, images, summary, details, features,
    engine_size, city, is_hybrid, sold
  } = req.body

  try {
    const [result] = await pool.query(
      `UPDATE cars SET
        type=?, make=?, model=?, year=?, price=?, price_unit=?,
        mileage=?, fuel=?, transmission=?, color=?, badge=?,
        image_url=?, images=?, summary=?, details=?, features=?,
        engine_size=?, city=?, is_hybrid=?, sold=?,
        updated_at=NOW()
       WHERE id=?`,
      [
        type, make, model, year, price,
        price_unit  || null,
        mileage, fuel, transmission, color,
        badge       || null,
        image_url   || null,
        JSON.stringify(Array.isArray(images)   ? images   : []),
        summary, details,
        JSON.stringify(Array.isArray(features) ? features : []),
        engine_size || null,
        city        || null,
        is_hybrid   ? 1 : 0,
        sold        ? 1 : 0,
        req.params.id,
      ]
    )
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Car not found' })
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id])
    res.json(parseCar(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// DELETE /api/cars/:id
async function deleteCar(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Car not found' })

    const car    = rows[0]
    const images = safeParseJSON(car.images, [])
    if (car.image_url) images.push(car.image_url)

    // Delete image files hosted on our server
    for (const url of images) {
      if (url && url.includes('beecars.co.zw/uploads/')) {
        const filename = path.basename(url)
        const filePath = path.join(UPLOAD_DIR, filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }
    }

    const [result] = await pool.query('DELETE FROM cars WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Car not found' })
    res.json({ message: 'Car deleted', id: Number(req.params.id) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getCars, getMakes, getCarById, createCar, updateCar, deleteCar }