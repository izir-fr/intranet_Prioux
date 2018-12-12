var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Event Schema
var fidRecapSchema = mongoose.Schema({
  shop: { type: String },
  year: { type: String },
  week: { type: String },
  Date: { type: String },
  Montant: { type: String },
  Client: { type: String },
  CP: { type: String }
})

module.exports = mongoose.model('FideliteRecap', fidRecapSchema)
