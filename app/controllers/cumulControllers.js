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

var weekSearch = (championnatDate) => {
  var date = []
  if (championnatDate.week_start > championnatDate.week_end) {
    for (var i = championnatDate.week_start; i <= 53; i++) {
      date.push({week: i , year: championnatDate.year_start})
    }
    for (var i = 1; i <= championnatDate.week_end; i++) {
      date.push({week: i , year: championnatDate.year_end})
    }    
  } else {
    for (var i = championnatDate.week_start; i <= championnatDate.week_end; i++) {
      date.push({week: i , year: championnatDate.year_end})
    }      
  }
  return date
}

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

var totalShop = (data, shop) => {
  if (shop.CA_caisse_P1 === undefined) {
    // console.log(shop.CA_caisse_P1)
    shop.CA_caisse_P1 = Number(data.CA_caisse_P1)
    shop.CA_caisse_P2 = Number(data.CA_caisse_P2)
    shop.PROG_CA_ttc = Number(data.PROG_CA_ttc)
    shop.POURC_marge_P1 = textToNumber(data.POURC_marge_P1)
    shop.MARGE_P1 = Number(data.MARGE_P1)
    shop.POURC_marge_P2 = textToNumber(data.POURC_marge_P2)
    shop.MARGE_P2 = Number(data.MARGE_P2)
    shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1)
    shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2)
    shop.PROG_Stock_fin = Number(data.PROG_Stock_fin)
    shop.STOCK_Theorique = Number(data.STOCK_Theorique)
    shop.STOCK_surplus_POURC = Number(data.STOCK_surplus_POURC)
    shop.Qt_venteCaisse_P1 = Number(data.Qt_venteCaisse_P1)
    shop.Qt_venteCaisse_P2 = Number(data.Qt_venteCaisse_P2)
    shop.PROG_Qt_Ventes = Number(data.PROG_Qt_Ventes)
    shop.Qt_tickets_P1 = Number(data.Qt_tickets_P1)
    shop.Qt_tickets_P2 = Number(data.Qt_tickets_P2)
    shop.PROG_Qt_ticket = Number(data.PROG_Qt_ticket)
    shop.IDV_P1 = textToNumber(data.IDV_P1)
    shop.IDV_P2 = textToNumber(data.IDV_P2)
    shop.PANIER_moyen_P1 = textToNumber(data.PANIER_moyen_P1)
    shop.PANIER_moyen_P2 = textToNumber(data.PANIER_moyen_P2)
    shop.PROG_PanierMoyen = textToNumber(data.PROG_PanierMoyen)
    shop.CA_m2_P1 = caSurface(shop.CA_caisse_P1, shop.shop)
    shop.CA_m2_P2 = caSurface(shop.CA_caisse_P2, shop.shop)
  } else {
    shop.CA_caisse_P1 = Number(data.CA_caisse_P1) + shop.CA_caisse_P1
    shop.CA_caisse_P2 = Number(data.CA_caisse_P2) + shop.CA_caisse_P2
    shop.PROG_CA_ttc = txProg(shop.CA_caisse_P1, shop.CA_caisse_P2)
    shop.MARGE_P1 = Number(data.MARGE_P1) + shop.MARGE_P1
    shop.POURC_marge_P1 = txMarge(shop.CA_caisse_P1, shop.MARGE_P1)
    shop.MARGE_P2 = Number(data.MARGE_P2) + shop.MARGE_P2
    shop.POURC_marge_P2 = txMarge(shop.CA_caisse_P2, shop.MARGE_P2)
    shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1) + shop.STOCK_fin_P1
    shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2) + shop.STOCK_fin_P2
    shop.PROG_Stock_fin = txProg(shop.STOCK_fin_P1, shop.STOCK_fin_P2)
    shop.STOCK_Theorique = Number(data.STOCK_Theorique) + shop.STOCK_Theorique
    shop.STOCK_surplus_POURC = surStock(shop.STOCK_fin_P2, shop.STOCK_Theorique)
    shop.Qt_venteCaisse_P1 = Number(data.Qt_venteCaisse_P1) + shop.Qt_venteCaisse_P1
    shop.Qt_venteCaisse_P2 = Number(data.Qt_venteCaisse_P2) + shop.Qt_venteCaisse_P2
    shop.PROG_Qt_Ventes = txProg(shop.Qt_venteCaisse_P1, shop.Qt_venteCaisse_P2)
    shop.Qt_tickets_P1 = Number(data.Qt_tickets_P1) + shop.Qt_tickets_P1
    shop.Qt_tickets_P2 = Number(data.Qt_tickets_P2) + shop.Qt_tickets_P2
    shop.PROG_Qt_ticket = txProg(shop.Qt_tickets_P1, shop.Qt_tickets_P2)
    shop.IDV_P1 = idv(shop.Qt_venteCaisse_P1, shop.Qt_tickets_P1)
    shop.IDV_P2 = idv(shop.Qt_venteCaisse_P2, shop.Qt_tickets_P2)
    shop.PANIER_moyen_P1 = panierMoyen(shop.CA_caisse_P1, shop.Qt_tickets_P1)
    shop.PANIER_moyen_P2 = panierMoyen(shop.CA_caisse_P2, shop.Qt_tickets_P2)
    shop.PROG_PanierMoyen = txProg(shop.PANIER_moyen_P1, shop.PANIER_moyen_P2)
    shop.CA_m2_P1 = caSurface(shop.CA_caisse_P1, shop.shop)
    shop.CA_m2_P2 = caSurface(shop.CA_caisse_P2, shop.shop)
  }

  return shop
}

var shopCumulCalc = (val) => {
  var datas = []
  var shops = []
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
      }         
    })
  }

  shops = groupByShop(datas, 'shop')
  datas.forEach((data) => {
    shops.forEach((shop) => {
      if (data.shop === shop.shop) {
        shop = totalShop(data, shop)
      }
    })
  })

  shops.forEach((shop, keyShop) => {
    shop = totalShop(shop, total)
  })

  return {data: shops, total: total}
}

// var dptCalc = (request, league) => {
//   return new Promise((resolve, reject) => {
//     require('../../custom_modules/compteurs').departement(request, (err) => {
//       if (err) {
//         reject(null)
//       }
//     }, (data) => {
//       var finalDatasLa = []
//       var finalDatasLb = []

//       if (data.data.length >= 1) {
//         data.data.forEach((search) => {
//           var filter = leagueB.find((elt) => {
//             return elt === search.departement
//           })

//           if (filter === undefined) {
//             if (search.departement !== 'Non défini' && search.departement !== 'SAC DE CAISSE' && search.departement !== 'SFA NON UTILISEE' && search.departement !== 'OFFRE CLUB & COLLECTIVITES' && search.departement !==  'PRODUITS NON COMMERCIALISES' && search.departement !== 'EQUITATION' && search.departement !== 'SPORTS OUTDOOR' && search.departement !== 'GOLF') {
//               finalDatasLa.push(search)
//             }          
//           } else {
//             finalDatasLb.push(search)
//           }
//         })        
//       }

//       if (league === 'LA') {
//         data.data = finalDatasLa
//       } else if (league === 'LB') {
//         data.data = finalDatasLb
//       }
//       resolve(data)
//     })      
//   })      
// }

// var dptCumulCalc = (val) => {
//   var datas = []
//   val.forEach((week, valKey) => {
//     var data = week
//     datas.push(data)

//     // calcul du championnat semaine
//     if (data.data.length >= 1) {
//       // calcul des poinst du tx d'évasion
//       data.data.forEach((populate, weekKey) => {
//         populate.total.PROG_euro_Marge_pourc = roundNumber(Number(populate.total.PROG_euro_Marge_pourc))
//         populate.total.STOCK_surplus_POURC = roundNumber(Number(populate.total.STOCK_surplus_POURC) * -1)
//         populate.points_total = roundNumber(Number(populate.total.PROG_euro_Marge_pourc.replace(/,/, '.')) + Number(populate.total.STOCK_surplus_POURC.replace(/,/, '.')))

//         // cumul calc
//         if ((valKey - 1) < 0) {
//           populate.cumul_points = populate.points_total
//         } else if (val[valKey - 1].data.length >= 1 || val[valKey - 1].data !== undefined) {
//           var prev = val[valKey - 1].data.find((obj) => {
//             if (obj.departement === populate.departement) {
//               return obj
//             }
//           })
//           if (prev !== undefined) {
//             populate.cumul_points = Number(populate.points_total) + Number(prev.cumul_points)
//           }
//         } else {
//           populate.cumul_points = populate.points_total
//         }
//       })
//       data.data.sort((a, b) => {
//         return b.cumul_points - a.cumul_points
//       })
//       data.data.forEach((classement, key) => {
//         classement.classement_general = key + 1
//       })
//       data.data.sort((a, b) => {
//         return b.points_total - a.points_total
//       })
//     }
//   })
//   return datas
// }

var champControllers = {
  shop: (req, res) => {
    var chptResults = []
    var weekNum = weekSearch(championnatDate)

    Promise
      .map(weekNum, (date) => {
        return shopCalc(date)
      })
      .then((val) => {
        var datas = shopCumulCalc(val)
        res.render('partials/compteurs/shop', {data: datas.data, total: datas.total, week: championnatDate, cumul: true})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  },
  departement: (req, res) => {
    // var chptResults = []
    // var weekNum = weekSearch(championnatDate)

    // Promise
    //   .map(weekNum, (date) => {
    //     return dptCalc(date, 'LA')
    //   })
    //   .then((val) => {
    //     var datas = dptCumulCalc(val)
    //     res.render('partials/compteurs/departement', {data: datas, date: championnatDate})
    //   })
    //   .catch((err) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //   }) 
  }
}

module.exports = champControllers
