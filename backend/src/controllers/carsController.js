const pool = require('../db')

// GET /api/cars?type=sale|hire
async function getCars(req, res) {
  try {
    const { type } = req.query
    let query = 'SELECT * FROM cars WHERE sold = FALSE'
    const params = []

    if (type === 'sale' || type === 'hire') {
      query += ' AND type = $1'
      params.push(type)
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/cars/:id
async function getCarById(req, res) {
  try {
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Car not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/cars  (protected)
async function createCar(req, res) {
  const {
    type, make, model, year, price, price_unit,
    mileage, fuel, transmission, color, badge,
    image_url, images,                // ← images array
    engine_size, engineSize,          // ← accept both casings
    city,                             // ← location
    is_hybrid, isHybrid,              // ← accept both casings
    summary, details, features,
  } = req.body

  if (!type || !make || !model || !year || !price || !summary || !details)
    return res.status(400).json({ error: 'Missing required fields' })

  // Normalise multi-image array — accept array or JSON string
  let imagesArr = []
  if (Array.isArray(images) && images.length > 0) {
    imagesArr = images
  } else if (typeof images === 'string') {
    try { imagesArr = JSON.parse(images) } catch {}
  }
  // Fall back to single image_url so old data still works
  const coverUrl = imagesArr[0] ?? image_url ?? null

  // Normalise engine size (camelCase from frontend, snake_case preferred)
  const engineSizeVal = engine_size || engineSize || null

  // Normalise hybrid flag
  const isHybridVal = is_hybrid === true || isHybrid === 'Yes'

  try {
    const result = await pool.query(
      `INSERT INTO cars
        (type, make, model, year, price, price_unit, mileage, fuel,
         transmission, color, badge,
         image_url, images,
         engine_size, city, is_hybrid,
         summary, details, features)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,
         $9,$10,$11,
         $12,$13,
         $14,$15,$16,
         $17,$18,$19)
       RETURNING *`,
      [
        type, make, model, year, price, price_unit ?? null,
        mileage, fuel, transmission, color, badge ?? null,
        coverUrl, imagesArr,
        engineSizeVal, city ?? null, isHybridVal,
        summary, details, features ?? [],
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// PUT /api/cars/:id  (protected)
async function updateCar(req, res) {
  const {
    type, make, model, year, price, price_unit,
    mileage, fuel, transmission, color, badge,
    image_url, images,
    engine_size, engineSize,
    city,
    is_hybrid, isHybrid,
    summary, details, features, sold,
  } = req.body

  let imagesArr = []
  if (Array.isArray(images) && images.length > 0) {
    imagesArr = images
  } else if (typeof images === 'string') {
    try { imagesArr = JSON.parse(images) } catch {}
  }
  const coverUrl = imagesArr[0] ?? image_url ?? null
  const engineSizeVal = engine_size || engineSize || null
  const isHybridVal = is_hybrid === true || isHybrid === 'Yes'

  try {
    const result = await pool.query(
      `UPDATE cars SET
        type=$1, make=$2, model=$3, year=$4, price=$5, price_unit=$6,
        mileage=$7, fuel=$8, transmission=$9, color=$10, badge=$11,
        image_url=$12, images=$13,
        engine_size=$14, city=$15, is_hybrid=$16,
        summary=$17, details=$18, features=$19, sold=$20,
        updated_at=NOW()
       WHERE id=$21
       RETURNING *`,
      [
        type, make, model, year, price, price_unit ?? null,
        mileage, fuel, transmission, color, badge ?? null,
        coverUrl, imagesArr,
        engineSizeVal, city ?? null, isHybridVal,
        summary, details, features ?? [], sold ?? false,
        req.params.id,
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Car not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// DELETE /api/cars/:id  (protected)
async function deleteCar(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM cars WHERE id = $1 RETURNING id', [req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Car not found' })
    res.json({ message: 'Car deleted', id: result.rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/cars/makes
async function getMakes(req, res) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT make FROM cars WHERE sold = FALSE ORDER BY make ASC`
      )
      res.json(result.rows.map(r => r.make))
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
  module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getMakes }