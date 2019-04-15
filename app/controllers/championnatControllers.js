var Promise = require('bluebird')

var championnatDate = require('../config/championnat').championnat_date

var leagueB = require('../config/championnat').leagueB

var roundNumber = require('../../custom_modules/mathFormules').round_number

var weekSearch = require('../../custom_modules/week_search')

var shopFid = (request) => {
  return new Promise((resolve, reject) => {
    require('../../custom_modules/compteurs').fidelite(request, (err) => {
      if (err) {
        reject(null)
      }
    }, (data) => {
      resolve(data)
    })
  })      
}

var dptCalc = (request, league) => {
  return new Promise((resolve, reject) => {
    require('../../custom_modules/compteurs').departement(request, (err) => {
      if (err) {
        reject(null)
      }
    }, (data) => {
      var finalDatasLa = []
      var finalDatasLb = []

      if (data.data.length >= 1) {
        data.data.forEach((search) => {
          var filter = leagueB.find((elt) => {
            return elt === search.departement
          })

          if (filter === undefined) {
            if (search.departement !== 'Non défini' && search.departement !== 'SAC DE CAISSE' && search.departement !== 'SFA NON UTILISEE' && search.departement !== 'OFFRE CLUB & COLLECTIVITES' && search.departement !==  'PRODUITS NON COMMERCIALISES' && search.departement !== 'EQUITATION' && search.departement !== 'SPORTS OUTDOOR' && search.departement !== 'GOLF') {
              finalDatasLa.push(search)
            }          
          } else {
            finalDatasLb.push(search)
          }
        })        
      }

      if (league === 'LA') {
        data.data = finalDatasLa
      } else if (league === 'LB') {
        data.data = finalDatasLb
      }
      resolve(data)
    })      
  })      
}

var shopChampCalc = (val) => {
  var datas = []
  val.forEach((week, valKey) => {
    var data = week
    if (data !== undefined) {
      datas.push(data)
    }
  })

  if (datas.length >= 1) {
    datas.forEach((data, valKey) => {
      // calcul du championnat semaine
      if (data.data.length >= 1) {
        data.data.forEach((populate, weekKey) => {
          // calcul des points du tx d'évasion
          var pointsFid

          populate.PROG_CA_ttc = roundNumber(populate.PROG_CA_ttc)
          populate.PROG_PanierMoyen = roundNumber(populate.PROG_PanierMoyen)
          populate.PROG_euro_Marge_pourc = roundNumber(Number(populate.PROG_euro_Marge_pourc.replace(/,/, '.')) * 3)
          populate.prog_idv = roundNumber((Number(populate.IDV_P2.replace(/,/, '.')) - Number(populate.IDV_P1.replace(/,/, '.'))) / Number(populate.IDV_P1.replace(/,/, '.')) *100)

          if (Number(populate.tx_evasion.replace(/,/, '.')) >= 0 && Number(populate.tx_evasion.replace(/,/, '.')) < 20) {
            pointsFid = 20
          } else if (Number(populate.tx_evasion.replace(/,/, '.')) >= 20 && Number(populate.tx_evasion.replace(/,/, '.')) < 40) {
            pointsFid = 10
          } else {
            pointsFid = 0
          }

          populate.points_fid = pointsFid
          populate.points_total = roundNumber(Number(populate.PROG_CA_ttc.replace(/,/, '.')) + Number(populate.PROG_euro_Marge_pourc.replace(/,/, '.')) + Number(populate.PROG_PanierMoyen.replace(/,/, '.')) + Number(populate.prog_idv.replace(/,/, '.')) + populate.points_fid)
          
          // cumul calc
          if ((valKey - 1) < 0) {
            populate.cumul_points = populate.points_total
          } else if (val[valKey - 1].data.length >= 1 || val[valKey - 1].data !== undefined) {
            var prev = val[valKey - 1].data.find((obj) => {
              if (obj.shop === populate.shop) {
                return obj
              }
            })
            if (prev !== undefined) {
              populate.cumul_points = Number(populate.points_total) + Number(prev.cumul_points)
            }
          } else {
            populate.cumul_points = populate.points_total
          }
        })
        data.data.sort((a, b) => {
          return b.cumul_points - a.cumul_points
        })
        data.data.forEach((classement, key) => {
          classement.classement_general = key + 1
        })
        data.data.sort((a, b) => {
          return b.points_total - a.points_total
        })
      }
    })    
  }

  return datas
}

var dptChampCalc = (val) => {
  var datas = []
  val.forEach((week, valKey) => {
    var data = week
    datas.push(data)

    // calcul du championnat semaine
    if (data.data.length >= 1) {
      // calcul des poinst du tx d'évasion
      data.data.forEach((populate, weekKey) => {
        populate.PROG_euro_Marge_pourc = roundNumber(Number(populate.PROG_euro_Marge_pourc))
        populate.STOCK_surplus_POURC = roundNumber(Number(populate.STOCK_surplus_POURC) * -1)
        populate.points_total = roundNumber(Number(populate.PROG_euro_Marge_pourc.replace(/,/, '.')) + Number(populate.STOCK_surplus_POURC.replace(/,/, '.')))

        // cumul calc
        if ((valKey - 1) < 0) {
          populate.cumul_points = populate.points_total
        } else if (val[valKey - 1].data.length >= 1 || val[valKey - 1].data !== undefined) {
          var prev = val[valKey - 1].data.find((obj) => {
            if (obj.departement === populate.departement) {
              return obj
            }
          })
          if (prev !== undefined) {
            populate.cumul_points = Number(populate.points_total) + Number(prev.cumul_points)
          }
        } else {
          populate.cumul_points = populate.points_total
        }
      })
      data.data.sort((a, b) => {
        return b.cumul_points - a.cumul_points
      })
      data.data.forEach((classement, key) => {
        classement.classement_general = key + 1
      })
      data.data.sort((a, b) => {
        return b.points_total - a.points_total
      })
    }
  })
  return datas
}

var champControllers = {
  shop: (req, res) => {
    var chptResults = []
    var weekNum = weekSearch(championnatDate)

    Promise
      .map(weekNum, (date) => {
        return shopFid(date)
          .then((val) => {
            console.log('OK')
            return val
          })
          .catch((err) => {
            if (err) {
              console.log(err)
            }
          }) 
      })
      .then((val) => {
        var datas = shopChampCalc(val)

        res.render('partials/championnat/shop', {data: datas, date: championnatDate})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  },
  departementL1: (req, res) => {
    var chptResults = []
    var weekNum = weekSearch(championnatDate)

    Promise
      .map(weekNum, (date) => {
        return dptCalc(date, 'LA')
      })
      .then((val) => {
        var datas = dptChampCalc(val)
        res.render('partials/championnat/departement', {data: datas, date: championnatDate})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  },
  departementL2: (req, res) => {
    var chptResults = []
    var weekNum = weekSearch(championnatDate)

    Promise
      .map(weekNum, (date) => {
        return dptCalc(date, 'LB')
      })
      .then((val) => {
        var datas = dptChampCalc(val)
        res.render('partials/championnat/departement', {data: datas, date: championnatDate})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  }
}

module.exports = champControllers
