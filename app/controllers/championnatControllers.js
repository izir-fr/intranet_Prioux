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
    
    var calc = (request) => {
      return new Promise((resolve, reject) => {
        require('../../custom_modules/compteurs').shop(request, (err) => {
          if (err) {
            reject('error')
          }
        }, (data) => {
          // console.log(data)
          resolve({data: data})
        })      
      })      
    }

    Promise
      .map(weekNum, (date) => {
        return calc(date)
      })
      .then((val) => {
        console.log(val)
        res.render('partials/championnat/shop', )
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
