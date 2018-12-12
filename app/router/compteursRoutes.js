var express = require('express')
var router = express.Router()

// Controllers
var compteursCtrl = require('../controllers/compteursControllers')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/shop', compteursCtrl.shopData)
router.get('/departement', compteursCtrl.departementData)
router.get('/details', compteursCtrl.detailsData)
router.get('/fidelite', compteursCtrl.fideliteData)

module.exports = router
