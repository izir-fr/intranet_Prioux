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
    return roundNumber(((valSecond - valPremier) / valPremier) * 100, 2)
  },
  tx_marge: (cattc, margeht) => {
    var roundNumber = mathFormules.round_number
    return roundNumber((margeht / (cattc / 1.2)) * 100, 2)
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
    if (!nbSemaine || !nbSemaine === undefined) {
      return roundNumber((cattc * 52) * 0.25, 2)
    } else {
      return roundNumber((cattc * 52 / nbSemaine) * 0.25, 2)
    }
    
  },
  sur_stock: (stockFin, stockTheo) => {
    var roundNumber = mathFormules.round_number
    return roundNumber(((stockFin / stockTheo) - 1) * 100, 2)
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
    var number = Number(val.replace(/,/, '.'))
    return roundNumber(number, 2)
  },
  sum: (tableauObjets, propriete) => {
    var total = tableauObjets.reduce((accumulateur, valeurCourante) => {
      var number = 0
      if (valeurCourante[propriete] !== undefined) {
        number = valeurCourante[propriete].replace(/,/, '.')
      }
      return accumulateur + Number(number)
    }, 0)

    return total
  }
}

module.exports = mathFormules
