// models
var ShopRecap = require('../models/shop-recap')
var DepartementRecap = require('../models/dpt-recap')
var FideliteRecap = require('../models/fidelite-recap')

// Controllers
var compteursControllers = {
  shopData: function (req, res) {
    if (req.query) {   
      ShopRecap
        .find({ week: req.query.week, year: req.query.year })
        .exec((err, datas) => {
          var total
          var shopDatas = []
          datas.forEach((val) => {
            if (val.shop === "total") {
              total = val
            } else {
              shopDatas.push(val)
            }
          })
          shopDatas.sort((a,b) => {
            return Number(b.CA_caisse_P2) - Number(a.CA_caisse_P2)
          })
          res.render('partials/compteurs/shop', {week: req.query.week, year: req.query.year, data: shopDatas, total: total})          
        })

    } else {
      res.render('partials/compteurs/shop')
    }
  },
  departementData: (req, res) => {
    if (req.query) {   
      DepartementRecap
        .find({ week: req.query.week, year: req.query.year })
        .exec((err, datas) => {
          var total
          var shopDatas = []
          datas.forEach((val) => {
            if (val.shop === "total") {
              total = val
            } else {
              shopDatas.push(val)
            }
          })
          shopDatas.sort((a,b) => {
            return Number(b.CA_caisse_P2) - Number(a.CA_caisse_P2)
          })
          res.render('partials/compteurs/departement', {week: req.query.week, year: req.query.year, data: shopDatas, total: total})          
        })

    } else {
      res.render('partials/compteurs/departement')
    }
  },
  detailsData: (req, res) => {
    // groupBy function
    var groupBy = (tableauObjets, propriete) => {
      var datas = []
      tableauObjets.forEach((obj) => {
        if (obj.departement !== 'TOTAUX') {
          var search = datas.find((val) => {
            return val[propriete] === obj[propriete]
          })
          if (search === undefined) {
            datas.push({
              departement: obj[propriete],
              datas: [],
              total: null
            })
          }          
        }
      })
      tableauObjets.forEach((obj) => {
        datas.forEach((search) => {
          if (obj[propriete] === search[propriete]) {
            search.datas.push(obj)
          }
        })
      })
      return datas
    }

    var sum = (tableauObjets, propriete) => {
      var total = tableauObjets.reduce((accumulateur, valeurCourante) => {
        
        return accumulateur + Number(valeurCourante[propriete])
      }, 0)

      return total
    }

    if (req.query) {   
      DepartementRecap
        .find({ week: req.query.week, year: req.query.year })
        .exec((err, datas) => {
          var total
          var detailsDatas = groupBy(datas, 'departement')
          // SUM
          detailsDatas.forEach((val) => {
            var total = {
              CA_P1: sum(val.datas, 'CA_P1'),
              CA_P2: sum(val.datas, 'CA_P2'),
              MARGE_P1: sum(val.datas, 'MARGE_P1'),
              MARGE_P2: sum(val.datas, 'MARGE_P2'),
              STOCK_fin_P1: sum(val.datas, 'STOCK_fin_P1'),
              STOCK_fin_P2: sum(val.datas, 'STOCK_fin_P2'),
              PROG_CA_ttc: null,
              POURC_marge_P1: null,
              POURC_marge_P2: null,
              PROG_POURC_Marge: null,
              PROG_euro_Marge_pourc: null,
              PROG_Stock_fin: null,
              STOCK_Theorique: sum(val.datas, 'STOCK_Theorique'),
              STOCK_surplus_POURC: null
            }
            val.total = total
            val.total.PROG_CA_ttc = ((total.CA_P2 - total.CA_P1)/ total.CA_P1) * 100
            val.total.POURC_marge_P1 = null
            val.total.POURC_marge_P2 = null
            val.total.PROG_POURC_Marge = null
            val.total.PROG_euro_Marge_pourc = null
            val.total.PROG_Stock_fin = null
            val.total.STOCK_surplus_POURC = null
          })

          // console.log(detailsDatas)
          res.render('partials/compteurs/details', {week: req.query.week, year: req.query.year, data: detailsDatas})          
        })

    } else {
      res.render('partials/compteurs/details')
    }
  },
  fideliteData: (req, res) => {
    res.render('partials/compteurs/fidelite')
  }
}

module.exports = compteursControllers
