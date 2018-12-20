var Handlebars = require('handlebars')

module.exports = {
  date: (val) => { return val.getDate() + '/' + (parseInt(val.getMonth()) + 1) + '/' + val.getFullYear() },
  dateFullYear: (val) => { return val.getUTCFullYear() },
  dateMonth: (val) => { return (val.getUTCMonth() + 1) },
  dateDay: (val) => { return val.getUTCDate() },
  dateHours: (val) => { return val.getUTCHours() },
  dateMinutes: (val) => { return val.getUTCMinutes() },
  dateMonthText: (val) => {
    var month = parseInt(val.getMonth()) + 1
    if (month === 1) {
      return 'Janvier'
    } else if (month === 2) {
      return 'Février'
    } else if (month === 3) {
      return 'Mars'
    } else if (month === 4) {
      return 'Avril'
    } else if (month === 5) {
      return 'Mai'
    } else if (month === 6) {
      return 'Juin'
    } else if (month === 7) {
      return 'Juillet'
    } else if (month === 8) {
      return 'Août'
    } else if (month === 9) {
      return 'Septembre'
    } else if (month === 10) {
      return 'Octobre'
    } else if (month === 11) {
      return 'Novembre'
    } else if (month === 12) {
      return 'Décembre'
    }
  },
  userDateDay: (val) => { return val.split('/')[0] },
  userDateMonth: (val) => { return val.split('/')[1] },
  userDateYear: (val) => { return val.split('/')[2] },
  utf8: (val) => {
    if (val) {
      try {
        return decodeURIComponent(val)
      } catch (err) {
        return ''
      }
    } else {
      return ''
    }
  },
  milleDisplay: (val) => {
    var number = Number(val).toLocaleString('fr-FR')
    if (number === 'NaN') {
      return val
    } else {
      return number.split(',').join(' ')
    }
  },
  year_select: () => {
    var out = ''
    for (var i = 1; i < 53; i++) {
      out = out + '<option value="' + i + '">' + i + '</option>'
    }
    return new Handlebars.SafeString(out)
  },
  prog_plus: (val) => {
    if (val && val !== undefined) {
      var number
      if (typeof val === 'number') {
        number = val
      } else {
        number = Number(val.replace(/,/, '.'))      
      }
      if (number >= 0) {
        return 'text-success'
      } else {
        return 'text-danger'
      }        
    }
  },
  prog_moins: (val) => {
    if (val && val !== undefined) {
      var number
      if (typeof val === 'number') {
        number = val
      } else {
        number = Number(val.replace(/,/, '.'))      
      }
      if (number >= 0) {
        return 'text-danger'
      } else {
        return 'text-success'
      }        
    }
  },
  evasion: (val) => {
    if (val && val !== undefined) {
      var number = Number(val.replace(/,/, '.'))
      if (number <= 33) {
        return 'text-success'
      } else {
        return 'text-danger'
      }      
    }
  }
}
