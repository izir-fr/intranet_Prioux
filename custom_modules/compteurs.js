// models
var ShopRecap = require('./../app/models/shop-recap')
var DepartementRecap = require('./../app/models/dpt-recap')
var FideliteRecap = require('./../app/models/fidelite-recap')

var sum = require('./mathFormules').sum

var roundNumber = require('./mathFormules').round_number

var surStock = require('./mathFormules').sur_stock

var textToNumber = require('./mathFormules').text_to_number

var txProg = require('./mathFormules').tx_prog

var txMarge = require('./mathFormules').tx_marge

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

var groupByDpt = (tableauObjets, propriete) => {
  var arr = []
  if (tableauObjets.length >= 1) {
    tableauObjets.forEach((val) => {
      var filter = arr.find((search) => {
        return val[propriete] === search[propriete]
      })

      if (!filter && val[propriete] !== 'TOTAUX') {
        arr.push({departement: val[propriete]})
      }
    })
  }
  return arr
}

var totalDpt = (data, shop) => {
  if (shop.CA_P1 === undefined) {
    shop.CA_P1 = Number(data.CA_P1)
    shop.CA_P2 = Number(data.CA_P2)
    shop.PROG_CA_ttc = Number(data.PROG_CA_ttc)
    shop.POURC_marge_P1 = textToNumber(data.POURC_marge_P1)
    shop.MARGE_P1 = Number(data.MARGE_P1)
    shop.POURC_marge_P2 = textToNumber(data.POURC_marge_P2)
    shop.MARGE_P2 = Number(data.MARGE_P2)
    shop.PROG_euro_Marge_pourc = Number(data.PROG_euro_Marge_pourc)
    shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1)
    shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2)
    shop.PROG_Stock_fin = Number(data.PROG_Stock_fin)
    shop.STOCK_Theorique = Number(data.STOCK_Theorique)
    shop.STOCK_surplus_POURC = Number(data.STOCK_surplus_POURC)
  } else {
    shop.CA_P1 = Number(data.CA_P1) + shop.CA_P1
    shop.CA_P2 = Number(data.CA_P2) + shop.CA_P2
    shop.PROG_CA_ttc = txProg(shop.CA_P1, shop.CA_P2)
    shop.MARGE_P1 = Number(data.MARGE_P1) + shop.MARGE_P1
    shop.POURC_marge_P1 = txMarge(shop.CA_P1, shop.MARGE_P1)
    shop.MARGE_P2 = Number(data.MARGE_P2) + shop.MARGE_P2
    shop.PROG_euro_Marge_pourc = txProg(shop.MARGE_P1, shop.MARGE_P2)
    shop.POURC_marge_P2 = txMarge(shop.CA_P2, shop.MARGE_P2)
    shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1) + shop.STOCK_fin_P1
    shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2) + shop.STOCK_fin_P2
    shop.PROG_Stock_fin = txProg(shop.STOCK_fin_P1, shop.STOCK_fin_P2)
    shop.STOCK_Theorique = Number(data.STOCK_Theorique) + shop.STOCK_Theorique
    shop.STOCK_surplus_POURC = surStock(shop.STOCK_fin_P2, shop.STOCK_Theorique)
  }

  return shop
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
    var departements = []
    var total = { departement: 'TOTAL' }
    var subTotal

    DepartementRecap
      .find({ week: req.week, year: req.year })
      .exec((err, datas) => {
        if (err) {
          error('db querry')
        } else if (datas.length < 1) {
          callback({week: req.week, year: req.year, data: {}, total: null})
        } else {
          departements = groupByDpt(datas, 'departement')
          if (departements === undefined) {
            error('group by')
          } else {
            datas.forEach((data) => {
              departements.forEach((departement) => {
                if (data.departement === departement.departement) {
                  departement = totalDpt(data, departement)
                }
              })
            })
            
            departements.sort((a, b) => {
              return b.CA_P2 - a.CA_P2
            })
            departements.forEach((departement) => {
              total = totalDpt(departement, total)
            })

            callback({week: req.week, year: req.year, data: departements, total: total})
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
              }
              val.total = total
              val.total.PROG_CA_ttc = roundNumber(((total.CA_P2 - total.CA_P1)/ total.CA_P1) * 100)
              val.total.PROG_Stock_fin = roundNumber(((total.STOCK_fin_P2 - total.STOCK_fin_P1)/ total.STOCK_fin_P1) * 100)
              val.total.PROG_euro_Marge_pourc = roundNumber(((total.MARGE_P2 - total.MARGE_P1)/ total.MARGE_P1) * 100)
              val.total.STOCK_surplus_POURC = surStock(total.STOCK_fin_P2, total.STOCK_Theorique)
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
    var api = []
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
              var elt = Object.assign({
                CARTE_fid_prog: roundNumber(((val.CARTE_fid_P2 - val.CARTE_fid_P1) / val.CARTE_fid_P1) * 100, 2),
                client_encarte_nb: 0,
                ca_encarte: 0
              }, val._doc)
              
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
                total = Object.assign({
                  client_encarte_nb: 0,
                  ca_encarte: 0
                }, total._doc)

                fidVal.forEach((obj) => {
                  shop = obj.shop.replace(remove, '')
                  fidDatas.forEach((search, key) => {
                    if (shop === search.shop && obj.Client !== '') {
                      var caClient = Number(obj.Montant.replace(/,/, '.'))
                      fidDatas[key].client_encarte_nb ++
                      fidDatas[key].ca_encarte += caClient
                      total.client_encarte_nb ++
                      total.ca_encarte += caClient
                    }                  
                  })
                })

                fidDatas.forEach((val, key) => {
                  var nonEncarte = fidDatas[key].Qt_tickets_P2 - fidDatas[key].client_encarte_nb
                  api.push(
                    Object.assign({
                      client_non_encarte_num:  nonEncarte,
                      tx_evasion:  roundNumber(nonEncarte / Number(fidDatas[key].Qt_tickets_P2) * 100, 2),
                      tx_encarte: roundNumber(fidDatas[key].client_encarte_nb / Number(fidDatas[key].Qt_tickets_P2) * 100, 2),
                      poids_ca: roundNumber(fidDatas[key].ca_encarte / fidDatas[key].CA_caisse_P2 *100, 2)                    
                    }, val)
                  )
                })

                var totalNonEncarte = total.Qt_tickets_P2 - total.client_encarte_nb
                total = Object.assign({
                  CARTE_fid_prog: roundNumber(((total.CARTE_fid_P2 - total.CARTE_fid_P1) / total.CARTE_fid_P1) * 100, 2),
                  client_non_encarte_num: totalNonEncarte,
                  tx_evasion: roundNumber(totalNonEncarte / Number(total.Qt_tickets_P2) * 100, 2),
                  tx_encarte: roundNumber(total.client_encarte_nb / total.Qt_tickets_P2 * 100, 2),
                  poids_ca: roundNumber(total.ca_encarte / total.CA_caisse_P2 *100, 2),
                  ca_encarte: roundNumber(total.ca_encarte, 2)
                }, total)

                api.sort((a,b) => {
                  return Number(b.Qt_tickets_P2) - Number(a.Qt_tickets_P2)
                })

                callback({week: req.week, year: req.year, data: api, total: total})             
              }
            })          
        }
      })    
  }
}

module.exports = algo
