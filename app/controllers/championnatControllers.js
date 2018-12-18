var Promise = require('bluebird')

var championnatDate = {
  week_start: 32,
  week_end: 6,
  year_start: 2018,
  year_end: 2019
}

var leagueB = [
  'GLISSE URBAINE',
  'JEUX',
  'TECHNOLOGIE',
  'GO FIT',
  'SPORTS D HIVER',
  'GO CARE',
  'SPORTS D EAU',
  'BEACHWEAR'
]

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

var champControllers = {
  shop: (req, res) => {
    var chptResults = []
    var weekNum = weekSearch(championnatDate)

    var fid = (request) => {
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
    
    var calc = (request) => {
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
            val.PROG_euro_Marge_pourc = roundNumber(Number(val.PROG_euro_Marge_pourc.replace(/,/, '.')) * 3)
            val.prog_idv = roundNumber((Number(val.IDV_P2.replace(/,/, '.')) - Number(val.IDV_P1.replace(/,/, '.'))) / Number(val.IDV_P1.replace(/,/, '.')) *100)
            finalDatas.push(val)
          })
          data.data = finalDatas
          resolve(data)
        })      
      })      
    }



    Promise
      .map(weekNum, (date) => {
        return calc(date)
      })
      .each((val) => {
        if (val.data.length >= 1) {
          return fid(val)
            .then((data) => {
              val.fid = data.data
              return val
            })
        } else {
          return val
        }
      })
      .then((val) => {
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
              if (val[valKey - 1].data.length >= 1) {
                var prev = val[valKey - 1].data.find((obj) => {
                  if (obj.shop === populate.shop) {
                    return obj
                  }
                })                
                populate.cumul_points = Number(populate.points_total) + Number(prev.points_total)
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
        res.render('partials/championnat/shop', {data: datas, date: championnatDate})
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      }) 
  },
  departementL1: (req, res) => {
    res.render('partials/championnat/shop', {date: championnatDate})
  },
  departementL2: (req, res) => {
    res.render('partials/championnat/shop', {date: championnatDate})
  }
}

module.exports = champControllers
