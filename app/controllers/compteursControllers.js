// models
var ShopRecap = require('../models/shop-recap')
var DepartementRecap = require('../models/dpt-recap')
var FideliteRecap = require('../models/fidelite-recap')

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
    if (valeurCourante[propriete] !== undefined) {
      var number = valeurCourante[propriete].replace(/,/, '.')
    }
    return accumulateur + Number(number)
  }, 0)

  return total
}

var total = (tableauObjets, propriete) => {
  var operation = tableauObjets.reduce((accumulateur, valeurCourante) => {
    var number = valeurCourante.total[propriete]
    if (number !== 'NaN' || number !== 'Infinity') {
      return accumulateur + Number(number)
    }
  }, 0)

  return operation
}

var roundNumber = (val) => {
  return Number.parseFloat(val).toFixed(2)
}

var surStock = (stockFin, stockTheo) => {
  return roundNumber(100 * ((stockFin / stockTheo) - 1))
}

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
          var subTotal
          var dptDatas
          datas.forEach((val) => {
            if (val.shop === "total") {
              total = val
            } else {
              dptDatas = groupBy(datas, 'departement')
            }
          })

          // SUM
          dptDatas.forEach((val) => {
            var total = {
              CA_P1: sum(val.datas, 'CA_P1'),
              CA_P2: sum(val.datas, 'CA_P2'),
              MARGE_P1: sum(val.datas, 'MARGE_P1'),
              MARGE_P2: sum(val.datas, 'MARGE_P2'),
              STOCK_fin_P1: sum(val.datas, 'STOCK_fin_P1'),
              STOCK_fin_P2: sum(val.datas, 'STOCK_fin_P2'),
              POURC_marge_P1: roundNumber(sum(val.datas, 'POURC_marge_P1') / 7),
              POURC_marge_P2: roundNumber(sum(val.datas, 'POURC_marge_P2') / 7),
              STOCK_Theorique: sum(val.datas, 'STOCK_Theorique'),
            }
            val.total = total
            val.total.PROG_CA_ttc = roundNumber(((total.CA_P2 - total.CA_P1)/ total.CA_P1) * 100)
            val.total.PROG_Stock_fin = roundNumber(((total.STOCK_fin_P2 - total.STOCK_fin_P1)/ total.STOCK_fin_P1) * 100)
            val.total.PROG_euro_Marge_pourc = roundNumber(((total.MARGE_P2 - total.MARGE_P1)/ total.MARGE_P1) * 100)
            val.total.STOCK_surplus_POURC =  surStock(total.STOCK_fin_P2, total.STOCK_Theorique)
          })

          subTotal = {
            CA_P1: total(dptDatas, 'CA_P1'),
            CA_P2: total(dptDatas, 'CA_P2'),
            MARGE_P1: total(dptDatas, 'MARGE_P1'),
            MARGE_P2: total(dptDatas, 'MARGE_P2'),
            STOCK_fin_P1: total(dptDatas, 'STOCK_fin_P1'),
            STOCK_fin_P2: total(dptDatas, 'STOCK_fin_P2'),
            POURC_marge_P1: roundNumber(total(dptDatas, 'POURC_marge_P1') / 7),
            POURC_marge_P2: roundNumber(total(dptDatas, 'POURC_marge_P2') / 7),
            STOCK_Theorique: total(dptDatas, 'STOCK_Theorique')
          }
          subTotal.PROG_CA_ttc = roundNumber(((subTotal.CA_P2 - subTotal.CA_P1) / subTotal.CA_P1) * 100)
          subTotal.PROG_Stock_fin = roundNumber(((subTotal.STOCK_fin_P2 - subTotal.STOCK_fin_P1) / subTotal.STOCK_fin_P1) * 100)
          subTotal.PROG_euro_Marge_pourc = roundNumber(((subTotal.MARGE_P2 - subTotal.MARGE_P1) / subTotal.MARGE_P1) * 100)
          subTotal.STOCK_surplus_POURC =  surStock(subTotal.STOCK_fin_P2, subTotal.STOCK_Theorique)

          dptDatas.sort((a,b) => {
            return Number(b.total.CA_P2) - Number(a.total.CA_P2)
          })
          res.render('partials/compteurs/departement', {week: req.query.week, year: req.query.year, data: dptDatas, total: subTotal})          
        })

    } else {
      res.render('partials/compteurs/departement')
    }
  },
  detailsData: (req, res) => {
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
              POURC_marge_P1: roundNumber(sum(val.datas, 'POURC_marge_P1') / 7),
              POURC_marge_P2: roundNumber(sum(val.datas, 'POURC_marge_P2') / 7),
              STOCK_Theorique: sum(val.datas, 'STOCK_Theorique'),
              STOCK_surplus_POURC: roundNumber(sum(val.datas, 'STOCK_surplus_POURC') / 7)
            }
            val.total = total
            val.total.PROG_CA_ttc = roundNumber(((total.CA_P2 - total.CA_P1)/ total.CA_P1) * 100)
            val.total.PROG_Stock_fin = roundNumber(((total.STOCK_fin_P2 - total.STOCK_fin_P1)/ total.STOCK_fin_P1) * 100)
            val.total.PROG_euro_Marge_pourc = roundNumber(((total.MARGE_P2 - total.MARGE_P1)/ total.MARGE_P1) * 100)
            // tri
            val.datas.sort((a,b) => {
              return Number(b.CA_P2) - Number(a.CA_P2)
            })
          })

          // console.log(detailsDatas)
          res.render('partials/compteurs/details', {week: req.query.week, year: req.query.year, data: detailsDatas})          
        })

    } else {
      res.render('partials/compteurs/details')
    }
  },
  fideliteData: (req, res) => {
    if (req.query) {   
      ShopRecap
        .find({ week: req.query.week, year: req.query.year })
        .exec((err, datas) => {
          var total
          var fidDatas = []
          datas.forEach((val) => {
            if (val.shop === "total") {
              total = val
            } else {
              fidDatas.push(val)
            }
          })
          fidDatas.sort((a,b) => {
            return Number(b.Qt_tickets_P2) - Number(a.Qt_tickets_P2)
          })
          res.render('partials/compteurs/fidelite', {week: req.query.week, year: req.query.year, data: fidDatas, total: total})          
        })

    } else {
      res.render('partials/compteurs/fidelite')
    }
  }
}

module.exports = compteursControllers
