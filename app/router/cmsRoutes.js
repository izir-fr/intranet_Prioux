var express = require('express')
var router = express.Router()

// Controllers
var cmsCtrl = require('../controllers/cmsControllers')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', cmsCtrl.index)

// Get robots.txt
router.get('/robots.txt', cmsCtrl.robots)

// Get robots.txt
router.post('/login', cmsCtrl.login)

module.exports = router
