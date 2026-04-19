const express = require('express')
const router  = express.Router()
const protect = require('../middleware/protect')
const { uploadImage, deleteImage } = require('../controllers/uploadController')

router.post('/',    protect, uploadImage)
router.delete('/',  protect, deleteImage)

module.exports = router