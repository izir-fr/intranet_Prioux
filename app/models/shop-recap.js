var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Event Schema
var shopRecapSchema = mongoose.Schema({
  shop: { type: String },
  year: { type: String },
  week: { type: String },
  CA_P1: { type: String },
  CA_P2: { type: String },
  CA_caisse_P1: { type: String },
  CA_caisse_P2: { type: String },
  MARGE_P1: { type: String },
  MARGE_P2: { type: String },
  Qt_venteCaisse_P1: { type: String },
  Qt_venteCaisse_P2: { type: String },
  STOCK_fin_P1: { type: String },
  STOCK_fin_P2: { type: String },
  Qt_tickets_P1: { type: String },
  Qt_tickets_P2: { type: String },
  PANIER_moyen_P1: { type: String },
  PANIER_moyen_P2: { type: String },
  Qt_ventes_P1: { type: String },
  Qt_ventes_P2: { type: String },
  CARTE_fid_P1: { type: String },
  CARTE_fid_P2: { type: String },
  PROG_CA_ttc: { type: String },
  POURC_marge_P1: { type: String },
  POURC_marge_P2: { type: String },
  PROG_POURC_Marge: { type: String },
  PROG_euro_Marge_pourc: { type: String },
  PROG_Qt_Ventes: { type: String },
  PROG_Stock_fin: { type: String },
  PROG_Qt_ticket: { type: String },
  PROG_PanierMoyen: { type: String },
  IDV_P1: { type: String },
  IDV_P2: { type: String },
  CA_m2_P1: { type: String },
  CA_m2_P2: { type: String },
  STOCK_Theorique: { type: String },
  STOCK_surplus_POURC: { type: String }
})

module.exports = mongoose.model('ShopRecap', shopRecapSchema)
