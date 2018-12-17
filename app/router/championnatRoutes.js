var express = require('express')
var router = express.Router()

// Controllers
var chptCtrl = require('../controllers/championnatControllers')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/shop', chptCtrl.shop)
router.get('/departement-l1', chptCtrl.departementL1)
router.get('/departement-l2', chptCtrl.departementL2)

module.exports = router
