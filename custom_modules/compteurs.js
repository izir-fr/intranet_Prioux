// models
var ShopRecap = require('./../app/models/shop-recap')
var DepartementRecap = require('./../app/models/dpt-recap')
var FideliteRecap = require('./../app/models/fidelite-recap')

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
    var number = 0
    if (valeurCourante[propriete] !== undefined) {
      number = valeurCourante[propriete].replace(/,/, '.')
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

var algo = {
  shop: (req, error, callback) => {
    ShopRecap
      .find({ week: req.week, year: req.year })
      .exec((err, datas) => {
        if (err) {
          error(err)
        } else {
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
          callback({week: req.week, year: req.year, data: shopDatas, total: total})              
        }
      })
  },
  departement: (req, error, callback) => {
    DepartementRecap
      .find({ week: req.week, year: req.year })
      .exec((err, datas) => {
        if (err) {
          error('db querry')
        } else if (datas.length < 1) {
          callback({week: req.week, year: req.year, data: {}, total: null})
        } else {
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
          if (dptDatas === undefined) {
            error('group by')
          } else {
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
            callback({week: req.week, year: req.year, data: dptDatas, total: subTotal})            
          }

        }
      })    
  },
  departementDetails: (req, error, callback) => {
    DepartementRecap
      .find({ week: req.week, year: req.year })
      .exec((err, datas) => {
        if (err || datas.length < 1) {
          error('db querry')
        } else {
          var total
          var detailsDatas = groupBy(datas, 'departement')
          // SUM
          if (detailsDatas === undefined) {
            error('group by')
          } else {
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
            callback({week: req.week, year: req.year, data: detailsDatas})          
          }
        }                  
      })    
  },
  fidelite: (req, error, callback) => {
    ShopRecap
      .find({ week: req.week, year: req.year })
      .exec((err, shopDatas) => {
        if (err || shopDatas.length < 1) {
          error('db querry')
        } else {
          var total
          var fidDatas = []
          shopDatas.forEach((val) => {
            if (val.shop === "total") {
              total = val
            } else {
              var elt = {
                shop: val.shop,
                Qt_tickets_P1: val.Qt_tickets_P1,
                Qt_tickets_P2: val.Qt_tickets_P2,
                CA_caisse_P2: val.CA_caisse_P2,
                PROG_Qt_ticket: val.PROG_Qt_ticket,
                CARTE_fid_P1: val.CARTE_fid_P1,
                CARTE_fid_P2: val.CARTE_fid_P2,
                CARTE_fid_prog: roundNumber(((val.CARTE_fid_P2 - val.CARTE_fid_P1) / val.CARTE_fid_P1) * 100),
                client_encarte: []
              }
              fidDatas.push(elt)
            }
          })

          FideliteRecap
            .find({ week: req.week, year: req.year })
            .exec((err, fidVal) => {
              if (err || fidVal.length < 1) {
                error('db querry')
              } else {
                var remove = /GO SPORT /gi
                total.client_encarte_num = 0
                total.ca_encarte = 0

                fidVal.forEach((obj) => {
                  shop = obj.shop.replace(remove, '')
                  fidDatas.forEach((search, key) => {
                    if (shop === search.shop && obj.Client !== '') {
                      fidDatas[key].client_encarte.push(obj)
                      total.client_encarte_num += 1
                      total.ca_encarte += Number(obj.Montant.replace(/,/, '.'))
                    }                  
                  })
                })

                fidDatas.forEach((val, key) => {
                  fidDatas[key].client_encarte_num = fidDatas[key].client_encarte.length
                  fidDatas[key].client_non_encarte_num = fidDatas[key].Qt_tickets_P2 - fidDatas[key].client_encarte.length
                  fidDatas[key].tx_evasion = roundNumber(fidDatas[key].client_non_encarte_num / fidDatas[key].Qt_tickets_P2 * 100)
                  fidDatas[key].tx_encarte = roundNumber(fidDatas[key].client_encarte_num / fidDatas[key].Qt_tickets_P2 * 100)
                  fidDatas[key].ca_encarte = roundNumber(sum(fidDatas[key].client_encarte, 'Montant'))
                  fidDatas[key].poids_ca = roundNumber(fidDatas[key].ca_encarte / fidDatas[key].CA_caisse_P2 *100)
                })

                total.CARTE_fid_prog = roundNumber(((total.CARTE_fid_P2 - total.CARTE_fid_P1) / total.CARTE_fid_P1) * 100)
                total.client_non_encarte_num = total.Qt_tickets_P2 - total.client_encarte_num
                total.tx_evasion = roundNumber(total.client_non_encarte_num / total.Qt_tickets_P2 * 100)
                total.tx_encarte = roundNumber(total.client_encarte_num / total.Qt_tickets_P2 * 100)
                total.poids_ca = roundNumber(total.ca_encarte / total.CA_caisse_P2 *100)
                total.ca_encarte = roundNumber(total.ca_encarte)

                fidDatas.sort((a,b) => {
                  return Number(b.Qt_tickets_P2) - Number(a.Qt_tickets_P2)
                })
                callback({week: req.week, year: req.year, data: fidDatas, total: total})             
              }
            })          
        }

      })    
  }
}

module.exports = algo