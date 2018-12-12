var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Event Schema
var dptRecapSchema = mongoose.Schema({
  shop: { type: String },
  departement: { type: String },
  year: { type: String },
  week: { type: String },
  CA_P1: { type: String },
  CA_P2: { type: String },
  MARGE_P1: { type: String },
  MARGE_P2: { type: String },
  STOCK_fin_P1: { type: String },
  STOCK_fin_P2: { type: String },
  PROG_CA_ttc: { type: String },
  POURC_marge_P1: { type: String },
  POURC_marge_P2: { type: String },
  PROG_POURC_Marge: { type: String },
  PROG_euro_Marge_pourc: { type: String },
  PROG_Stock_fin: { type: String },
  STOCK_Theorique: { type: String },
  STOCK_surplus_POURC: { type: String }
})

module.exports = mongoose.model('DepartementRecap', dptRecapSchema)
