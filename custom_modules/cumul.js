var sum = require('./mathFormules').sum

var roundNumber = require('./mathFormules').round_number

var surStock = require('./mathFormules').sur_stock

var textToNumber = require('./mathFormules').text_to_number

var txProg = require('./mathFormules').tx_prog

var txMarge = require('./mathFormules').tx_marge

var stockTheo = require('./mathFormules').stock_theorique

var caSurface = require('./mathFormules').ca_surface

var idv = require('./mathFormules').idv

var panierMoyen = require('./mathFormules').panier_moyen

var cumul = {
    totalShop: (data, shop, subtotal, nbSemaine) => {
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
        if (subtotal) {
          shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1)
          shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2)    
        } else {
          shop.STOCK_fin_P1 = Number(data.STOCK_fin_P1) + shop.STOCK_fin_P1
          shop.STOCK_fin_P2 = Number(data.STOCK_fin_P2) + shop.STOCK_fin_P2  
        }
        shop.PROG_Stock_fin = txProg(shop.STOCK_fin_P1, shop.STOCK_fin_P2)
        shop.STOCK_Theorique = stockTheo(shop.CA_caisse_P2, nbSemaine)
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
    },
    totalDepartement: (data, dpt, subtotal, nbSemaine) => {
      if (dpt.CA_P1 === undefined) {
        console.log(data)
        // console.log(dpt.CA_caisse_P1)
        dpt.CA_P1 = Number(data.CA_P1)
        dpt.CA_P2 = Number(data.CA_P2)
        dpt.PROG_CA_ttc = Number(data.PROG_CA_ttc)
        dpt.POURC_marge_P1 = Number(data.POURC_marge_P1)
        dpt.MARGE_P1 = Number(data.MARGE_P1)
        dpt.POURC_marge_P2 = Number(data.POURC_marge_P2)
        dpt.MARGE_P2 = Number(data.MARGE_P2)
        dpt.STOCK_fin_P1 = Number(data.STOCK_fin_P1)
        dpt.STOCK_fin_P2 = Number(data.STOCK_fin_P2)
        dpt.PROG_Stock_fin = Number(data.PROG_Stock_fin)
        dpt.STOCK_Theorique = Number(data.STOCK_Theorique)
        dpt.STOCK_surplus_POURC = Number(data.STOCK_surplus_POURC)
        // dpt.Qt_venteCaisse_P1 = Number(data.Qt_venteCaisse_P1)
        // dpt.Qt_venteCaisse_P2 = Number(data.Qt_venteCaisse_P2)
        // dpt.PROG_Qt_Ventes = Number(data.PROG_Qt_Ventes)
        // dpt.Qt_tickets_P1 = Number(data.Qt_tickets_P1)
        // dpt.Qt_tickets_P2 = Number(data.Qt_tickets_P2)
        // dpt.PROG_Qt_ticket = Number(data.PROG_Qt_ticket)
        // dpt.IDV_P1 = textToNumber(data.IDV_P1)
        // dpt.IDV_P2 = textToNumber(data.IDV_P2)
        // dpt.PANIER_moyen_P1 = textToNumber(data.PANIER_moyen_P1)
        // dpt.PANIER_moyen_P2 = textToNumber(data.PANIER_moyen_P2)
        // dpt.PROG_PanierMoyen = textToNumber(data.PROG_PanierMoyen)
        // dpt.CA_m2_P1 = caSurface(dpt.CA_caisse_P1, dpt.dpt)
        // dpt.CA_m2_P2 = caSurface(dpt.CA_caisse_P2, dpt.dpt)
      } else {
        dpt.CA_P1 = Number(data.CA_P1) + dpt.CA_P1
        dpt.CA_P2 = Number(data.CA_P2) + dpt.CA_P2
        dpt.PROG_CA_ttc = txProg(dpt.CA_P1, dpt.CA_P2)
        dpt.MARGE_P1 = Number(data.MARGE_P1) + dpt.MARGE_P1
        dpt.POURC_marge_P1 = txMarge(dpt.CA_P1, dpt.MARGE_P1)
        dpt.MARGE_P2 = Number(data.MARGE_P2) + dpt.MARGE_P2
        dpt.POURC_marge_P2 = txMarge(dpt.CA_P2, dpt.MARGE_P2)
        if (subtotal) {
          dpt.STOCK_fin_P1 = Number(data.STOCK_fin_P1)
          dpt.STOCK_fin_P2 = Number(data.STOCK_fin_P2)    
        } else {
          dpt.STOCK_fin_P1 = Number(data.STOCK_fin_P1) + dpt.STOCK_fin_P1
          dpt.STOCK_fin_P2 = Number(data.STOCK_fin_P2) + dpt.STOCK_fin_P2  
        }
        dpt.PROG_Stock_fin = txProg(dpt.STOCK_fin_P1, dpt.STOCK_fin_P2)
        dpt.STOCK_Theorique = stockTheo(dpt.CA_P2, nbSemaine)
        dpt.STOCK_surplus_POURC = surStock(dpt.STOCK_fin_P2, dpt.STOCK_Theorique)
        dpt.PROG_euro_Marge_pourc =  txProg(dpt.MARGE_P1, dpt.MARGE_P2)
        // dpt.Qt_venteCaisse_P1 = Number(data.Qt_venteCaisse_P1) + dpt.Qt_venteCaisse_P1
        // dpt.Qt_venteCaisse_P2 = Number(data.Qt_venteCaisse_P2) + dpt.Qt_venteCaisse_P2
        // dpt.PROG_Qt_Ventes = txProg(dpt.Qt_venteCaisse_P1, dpt.Qt_venteCaisse_P2)
        // dpt.Qt_tickets_P1 = Number(data.Qt_tickets_P1) + dpt.Qt_tickets_P1
        // dpt.Qt_tickets_P2 = Number(data.Qt_tickets_P2) + dpt.Qt_tickets_P2
        // dpt.PROG_Qt_ticket = txProg(dpt.Qt_tickets_P1, dpt.Qt_tickets_P2)
        // dpt.IDV_P1 = idv(dpt.Qt_venteCaisse_P1, dpt.Qt_tickets_P1)
        // dpt.IDV_P2 = idv(dpt.Qt_venteCaisse_P2, dpt.Qt_tickets_P2)
        // dpt.PANIER_moyen_P1 = panierMoyen(dpt.CA_caisse_P1, dpt.Qt_tickets_P1)
        // dpt.PANIER_moyen_P2 = panierMoyen(dpt.CA_caisse_P2, dpt.Qt_tickets_P2)
        // dpt.PROG_PanierMoyen = txProg(dpt.PANIER_moyen_P1, dpt.PANIER_moyen_P2)
        // dpt.CA_m2_P1 = caSurface(dpt.CA_caisse_P1, dpt.dpt)
        // dpt.CA_m2_P2 = caSurface(dpt.CA_caisse_P2, dpt.dpt)
      }

      return dpt
    }
}


module.exports = cumul
