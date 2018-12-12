var express = require('express')
var router = express.Router()

// Controllers
var importCtrl = require('../controllers/importControllers')

// lauch import
router.get('/shop', importCtrl.getImportShop)

router.post('/shop', importCtrl.postImportShop)

router.get('/departement', importCtrl.getImportDpt)

router.post('/departement', importCtrl.postImportDpt)

router.get('/fidelite', importCtrl.getImportFid)

router.post('/fidelite', importCtrl.postImportFid)

module.exports = router
