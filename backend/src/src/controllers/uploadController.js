const fs   = require('fs')
const path = require('path')

// Folder inside public_html that will serve images publicly
// Adjust this absolute path to match your cPanel setup
const UPLOAD_DIR = '/home/beecars3/public_html/uploads'

// Make sure the folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

// POST /api/upload  { base64, filename }
async function uploadImage(req, res) {
  try {
    const { base64, filename } = req.body
    if (!base64 || !filename) {
      return res.status(400).json({ error: 'base64 and filename are required' })
    }

    // Strip data:image/...;base64, prefix
    const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      return res.status(400).json({ error: 'Invalid base64 image format' })
    }

    const ext      = matches[1]   // e.g. jpeg, png, webp
    const data     = matches[2]
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}.${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)

    fs.writeFileSync(filePath, Buffer.from(data, 'base64'))

    const url = `https://beecars.co.zw/uploads/${safeName}`
    res.json({ url })
  } catch (err) {
    console.error('UPLOAD ERROR:', err)
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/upload  { url }
async function deleteImage(req, res) {
  try {
    const { url } = req.body
    if (!url) return res.status(400).json({ error: 'url is required' })

    // Only delete files that belong to our uploads folder
    const filename = path.basename(url)
    const filePath = path.join(UPLOAD_DIR, filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ deleted: true })
  } catch (err) {
    console.error('DELETE IMAGE ERROR:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { uploadImage, deleteImage }
