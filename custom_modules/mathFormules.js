var abs = (x) => {
  if (Number(x) > 0) {
    return x
  } else if (Number(x) < 0) {
    return Number(x) * -1
  } else {
    return x
  }
}

var mathFormules = {
  round_number: (value, decimal) => {
    var round
    if (decimal) {
      round = decimal
    } else {
      round = 0
    }
    return Number.parseFloat(value).toFixed(round)
  },
  tx_prog: (valPremier, valSecond) => {
    var roundNumber = mathFormules.round_number
    var prog = roundNumber(((valSecond - valPremier) / abs(valPremier)) * 100, 2)
    if (prog === NaN || prog === 'NaN') {
      return 0
    } else if (prog === Infinity || prog === 'Infinity') {
      return 100
    } else {
      return prog
    }
  },
  tx_marge: (cattc, margeht) => {
    var roundNumber = mathFormules.round_number
    var taux = roundNumber((margeht / (cattc / 1.2)) * 100, 2)
    if (taux === NaN || taux === 'NaN') {
      return 0
    } else {
      return taux
    }
  },
  idv: (quantiteVente, quantiteTiquets) => {
    var roundNumber = mathFormules.round_number
    return roundNumber(quantiteVente / quantiteTiquets, 2)
  },
  panier_moyen: (cattc, qtTickets) => {
    var roundNumber = mathFormules.round_number
    return roundNumber(cattc / qtTickets, 2)
  },
  stock_theorique: (cattc, nbSemaine) => {
    var roundNumber = mathFormules.round_number
    var stockVal
    if (!nbSemaine || !nbSemaine === undefined) {
      stockVal = roundNumber((cattc * 52) * 0.25, 2)
    } else {
      stockVal = roundNumber((cattc * 52 / nbSemaine) * 0.25, 2)
    }
    if (stockVal === NaN || stockVal === 'NaN') {
      return 0
    } else {
      return stockVal
    }
  },
  sur_stock: (stockFin, stockTheo) => {
    var roundNumber = mathFormules.round_number
    var surStock = roundNumber(((stockFin / stockTheo) - 1) * 100, 2)
    if (surStock === NaN || surStock === 'NaN') {
      return 0
    } else if (surStock === Infinity || surStock === 'Infinity') {
      return 100
    } else {
      return surStock
    }
  },
  ca_surface: (cattc, shop_querry) => {
    var shop = require('../app/config/shop').find((search) => {
      if (search.shop === shop_querry) {
        return search
      } 
    })
    var roundNumber = mathFormules.round_number
    return roundNumber(cattc / shop.surface, 0)      
  },
  text_to_number: (val) => {
    var roundNumber = mathFormules.round_number
    var number = Number(val.replace(/[,]/, '.'))
    return roundNumber(number, 2)
  },
  sum: (tableauObjets, propriete) => {
    var total = tableauObjets.reduce((accumulateur, valeurCourante) => {
      var number = 0
      if (valeurCourante[propriete] !== undefined) {
        number = valeurCourante[propriete].replace(/[,]/, '.')
      }
      return accumulateur + Number(number)
    }, 0)

    return total
  }
}

module.exports = mathFormules
