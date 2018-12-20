var Promise = require('bluebird')

var championnatDate = require('../config/championnat').championnat_date

var leagueB = require('../config/championnat').leagueB

var roundNumber = (val) => {
  return Number.parseFloat(val).toFixed(0)
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

var shopCalc = (request) => {
  return new Promise((resolve, reject) => {
    require('../../custom_modules/compteurs').shop(request, (err) => {
      if (err) {
        reject(null)
      }
    }, (data) => {
      var finalDatas = []
      // var idv = data
      data.data.forEach((val) => {
        val.PROG_CA_ttc = roundNumber(val.PROG_CA_ttc)
        val.PROG_PanierMoyen = roundNumber(val.PROG_PanierMoyen)
        val.PROG_euro_Marge_pourc = roundNumber(Number(val.PROG_euro_Marge_pourc.replace(/,/, '.')) * 3)
        val.prog_idv = roundNumber((Number(val.IDV_P2.replace(/,/, '.')) - Number(val.IDV_P1.replace(/,/, '.'))) / Number(val.IDV_P1.replace(/,/, '.')) *100)
        finalDatas.push(val)
      })
      data.data = finalDatas
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
    datas.push(data)

    // calcul du championnat semaine
    if (data.data.length >= 1) {
      // calcul des poinst du tx d'évasion
      data.data.forEach((populate, weekKey) => {
        data.fid.forEach((search) => {
          if (populate.shop === search.shop) {
            var points
            if (Number(search.tx_evasion.replace(/,/, '.')) >= 0 && Number(search.tx_evasion.replace(/,/, '.')) < 20) {
              points = 20
            } else if (Number(search.tx_evasion.replace(/,/, '.')) >= 20 && Number(search.tx_evasion.replace(/,/, '.')) < 40) {
              points = 10
            } else {
              points = 0
            }
            populate.points_fid = points
          }
        })
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
        populate.total.PROG_euro_Marge_pourc = roundNumber(Number(populate.total.PROG_euro_Marge_pourc))
        populate.total.STOCK_surplus_POURC = roundNumber(Number(populate.total.STOCK_surplus_POURC) * -1)
        populate.points_total = roundNumber(Number(populate.total.PROG_euro_Marge_pourc.replace(/,/, '.')) + Number(populate.total.STOCK_surplus_POURC.replace(/,/, '.')))

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
        return shopCalc(date)
      })
      .each((val) => {
        if (val.data.length >= 1) {
          return shopFid(val)
            .then((data) => {
              val.fid = data.data
              return val
            })
        } else {
          return val
        }
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
