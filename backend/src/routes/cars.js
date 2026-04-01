const express = require('express')
const router  = express.Router()
const protect = require('../middleware/protect')
const {
  getCars, getCarById, createCar, updateCar, deleteCar, getMakes
} = require('../controllers/carsController')

router.get('/makes', getMakes)
router.get('/',     getCars)          // public
router.get('/:id',  getCarById)       // public
router.post('/',    protect, createCar)    // dealer only
router.put('/:id',  protect, updateCar)   // dealer only
router.delete('/:id', protect, deleteCar) // dealer only

module.exports = router