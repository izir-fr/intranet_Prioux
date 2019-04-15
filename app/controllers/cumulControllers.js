var Promise = require('bluebird')

var championnatDate = require('../config/championnat').championnat_date

var roundNumber = require('../../custom_modules/mathFormules').round_number

var txProg = require('../../custom_modules/mathFormules').tx_prog

var txMarge = require('../../custom_modules/mathFormules').tx_marge

var idv = require('../../custom_modules/mathFormules').idv

var panierMoyen = require('../../custom_modules/mathFormules').panier_moyen

var caSurface = require('../../custom_modules/mathFormules').ca_surface

var surStock = require('../../custom_modules/mathFormules').sur_stock

var textToNumber = require('../../custom_modules/mathFormules').text_to_number

var sum = require('../../custom_modules/mathFormules').sum

var stockTheo = require('../../custom_modules/mathFormules').stock_theorique

var groupByShop = (tableauObjets, propriete) => {
  var arr = []
  if (tableauObjets.length >= 1) {
    tableauObjets.forEach((val) => {
      var filter = arr.find((search) => {
        return val[propriete] === search[propriete]
      })

      if (!filter) {
        arr.push({shop: val[propriete]})
      }
    })
  }
  return arr
}

var groupByDpt = (tableauObjets, propriete) => {
  var arr = []
  if (tableauObjets.length >= 1) {
    tableauObjets.forEach((val) => {
      var filter = arr.find((search) => {
        return val[propriete] === search[propriete]
      })

      if (!filter) {
        arr.push({departement: val[propriete]})
      }
    })
  }
  return arr
}

var weekSearch = require('../../custom_modules/week_search')

var shopCalc = (request) => {
  return new Promise((resolve, reject) => {
    require('../../custom_modules/compteurs').shop(request, (err) => {
      if (err) {
        reject(null)
      }
    }, (data) => {
      resolve(data)
    })      
  })      
}

var totalShop = require('../../custom_modules/cumul').totalShop
var totalDepartement = require('../../custom_modules/cumul').totalDepartement

var shopCumulCalc = (val) => {
  var datas = []
  var shops = []
  var nbSemaine = 0
  var total = { shop: 'TOTAL' }

  if (val.length >= 1) {
    val.forEach((weeks, valKey) => {
      var data = weeks

      // calcul du championnat semaine
      if (data.data.length >= 1) {
        // calcul des poinst du tx d'évasion
        data.data.forEach((populate, weekKey) => {
          datas.push(populate)
        })
        nbSemaine ++
      }         
    })
  }

  shops = groupByShop(datas, 'shop')

  datas.forEach((data) => {
    shops.forEach((shop) => {
      if (data.shop === shop.shop) {
        var subtotal = true
        shop = totalShop(data, shop, subtotal, nbSemaine)
      }
    })
  })

  shops.forEach((shop, keyShop) => {
    var subtotal = false
    total = totalShop(shop, total, subtotal, nbSemaine)
  })

  return {data: shops, total: total}
}

var dptCalc = (weekNum) => {
  return new Promise ((resolve, reject) => {
    require('../../custom_modules/compteurs').departement(weekNum, (err) => {
      if (err) {
        reject(null)
      }
    }, (data) => {
      resolve(data)
    })      
  })      
}

var dptCumulCalc = (val) => {
  var datas = []
  var dpt = []
  var nbSemaine = 0
  var total = { shop: 'TOTAL' }

  if (val.length >= 1) {
    val.forEach((weeks, valKey) => {
      var data = weeks

      // calcul du championnat semaine
      if (data.data.length >= 1) {
        // calcul des poinst du tx d'évasion
        data.data.forEach((populate, weekKey) => {
          datas.push(populate)
        })
        nbSemaine ++
      }         
    })
  }

  dpt = groupByDpt(datas, 'departement')

  datas.forEach((data) => {
    dpt.forEach((departement) => {
      if (data.departement === departement.departement) {
        var subtotal = true
        departement = totalDepartement(data, departement, subtotal, nbSemaine)
      }
    })
  })

  dpt.forEach((departement, keyShop) => {
    var subtotal = false
    total = totalDepartement(departement, total, subtotal, nbSemaine)
  })

  return {data: dpt, total: total}
}

var champControllers = {
  shop: (req, res) => {
    var chptResults = []
    var periodeSetup

    // definition de la periode d'analyse
    if (req.query.week_start !== undefined) {
      periodeSetup = req.query
    } else {
      periodeSetup = championnatDate
    }

    var weekNum = weekSearch(periodeSetup)

    Promise
      .map(weekNum, (date) => {
        return shopCalc(date)
      })
      .then((val) => {
        var datas = shopCumulCalc(val)
        res.render('partials/compteurs/shop', {data: datas.data, total: datas.total, week: periodeSetup, cumul: true})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  },
  departement: (req, res) => {
    var chptResults = []
    var periodeSetup

    // definition de la periode d'analyse
    if (req.query.week_start !== undefined) {
      periodeSetup = req.query
    } else {
      periodeSetup = championnatDate
    }

    var weekNum = weekSearch(periodeSetup)

    Promise
      .map(weekNum, (date) => {
        return dptCalc(date)
      })
      .then((val) => {
        var datas = dptCumulCalc(val)
        res.render('partials/compteurs/departement', { data: datas.data, total: datas.total, week: periodeSetup, cumul: true })
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  }
}

module.exports = champControllers
