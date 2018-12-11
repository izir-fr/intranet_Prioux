var express = require('express')
var router = express.Router()

// Controllers
var cmsCtrl = require('../controllers/cmsControllers')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', cmsCtrl.index)

module.exports = router
