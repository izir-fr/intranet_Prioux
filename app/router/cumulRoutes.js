var express = require('express')
var router = express.Router()

// Controllers
var cumulCtrl = require('../controllers/cumulControllers')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/shop', cumulCtrl.shop)
router.get('/departement', cumulCtrl.departement)

module.exports = router
