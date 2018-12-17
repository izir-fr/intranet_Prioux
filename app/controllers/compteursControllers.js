// Controllers
var compteursControllers = {
  shopData: function (req, res) {
    if (req.query) {   
      require('../../custom_modules/compteurs').shop(req.query, (err) => {
        if (err) {
          res.render('partials/compteurs/shop')
        }
      }, (data) => {
        res.render('partials/compteurs/shop', data)
      })
    } else {
      res.render('partials/compteurs/shop')
    }
  },
  departementData: (req, res) => {
    if (req.query) {   
      require('../../custom_modules/compteurs').departement(req.query, (err) => {
        if (err) {
          res.render('partials/compteurs/departement')
        }
      }, (data) => {
        res.render('partials/compteurs/departement', data)
      })
    } else {
      res.render('partials/compteurs/departement')
    }
  },
  detailsData: (req, res) => {
    if (req.query) {   
      require('../../custom_modules/compteurs').departementDetails(req.query, (err) => {
        if (err) {
          res.render('partials/compteurs/details')
        }
      }, (data) => {
        res.render('partials/compteurs/details', data)
      })
    } else {
      res.render('partials/compteurs/details')
    }
  },
  fideliteData: (req, res) => {
    if (req.query) {
      require('../../custom_modules/compteurs').fidelite(req.query, (err) => {
        if (err) {
          res.render('partials/compteurs/fidelite')
        }
      }, (data) => {
        res.render('partials/compteurs/fidelite', data)
      })
    } else {
      res.render('partials/compteurs/fidelite')
    }
  }
}

module.exports = compteursControllers
