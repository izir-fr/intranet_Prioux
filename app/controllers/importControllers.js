const csvtojsonV2 = require('csvtojson')
const path = require('path')
var ShopRecap = require('../models/shop-recap')
var DepartementRecap = require('../models/dpt-recap')
var FideliteRecap = require('../models/fidelite-recap')

var importCtrl = {
  // SHOP
  getImportShop: (req, res) => {
    if (process.env.LOCAL) {
      res.render('partials/import/form', {title: "Magasin", form: "shop"})
    } else {
      res.redirect('/') 
    }
  },
  postImportShop: (req, res) => {
    if (process.env.LOCAL) {
      console.log('import start')
      const fileShop = path.join(__dirname, '../../import/' + req.body.file)
      const csv = require('csvtojson')
      csv()
        .fromFile(fileShop)
        .then((jsonObj)=>{
            jsonObj.forEach((val) => {
              val.week = req.body.week
              val.year = req.body.year

              var singleShopRecap = new ShopRecap(val)
              singleShopRecap.save(function (err, recap) {
                if (err) {
                  console.log({
                    error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                    magasin: val.shop
                  })
                }
                console.log(recap)
              })
            })
        })
        .then(()=> {
          res.redirect('/')  
        })
    } else {
      res.redirect('/')  
    }
  },
  // DEPARTEMENT
  getImportDpt: (req, res) => {
    if (process.env.LOCAL) {
      // DepartementRecap
      //   .deleteMany({week: 52})
      //   .exec((err, res) => {
      //     console.log(res.length)
      //   })
      res.render('partials/import/form', {title: "Département", form: "departement"})
    } else {
      res.redirect('/') 
    }
  },
  postImportDpt: (req, res) => {
    if (process.env.LOCAL) {
      console.log('import start')
      const fileShop = path.join(__dirname, '../../import/' + req.body.file)
      const csv = require('csvtojson')
      csv()
        .fromFile(fileShop)
        .then((jsonObj)=>{
            jsonObj.forEach((val) => {
              val.week = req.body.week
              val.year = req.body.year

              var singleDptRecap = new DepartementRecap(val)
              singleDptRecap.save(function (err, recap) {
                if (err) {
                  console.log({
                    error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                    magasin: val.shop
                  })
                }
                console.log(recap)
              })
            })
        })
        .then(()=> {
          res.redirect('/')  
        })
    } else {
      res.redirect('/')  
    }
  },
  // FIDELITE
  getImportFid: (req, res) => {
    if (process.env.LOCAL) {
      res.render('partials/import/form', {title: "fidelité", form: "fidelite"})
    } else {
      res.redirect('/') 
    }
  },
  postImportFid: (req, res) => {
    if (process.env.LOCAL) {
      console.log('import start')
      const fileShop = path.join(__dirname, '../../import/' + req.body.file)
      const csv = require('csvtojson')
      csv()
        .fromFile(fileShop)
        .then((jsonObj)=>{
            jsonObj.forEach((val) => {
              val.week = req.body.week
              val.year = req.body.year
              val.shop = val.Magasin

              var singlefidRecap = new FideliteRecap(val)
              singlefidRecap.save(function (err, recap) {
                if (err) {
                  console.log({
                    error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                    magasin: val.shop
                  })
                }
                console.log(recap)
              })
            })
        })
        .then(()=> {
          res.redirect('/')  
        })
    } else {
      res.redirect('/')  
    }
  }, 
  // all
  getImportAll: (req, res) => {
    if (process.env.LOCAL) {
      res.render('partials/import/form-all', {title: "Tout", form: "all"})
    } else {
      res.redirect('/') 
    }
  },
  postImportAll: (req, res) => {
    if (process.env.LOCAL) {
      console.log('import start')
      const fileShop = path.join(__dirname, '../../import/' + req.body.file_shop)
      const fileDpt = path.join(__dirname, '../../import/' + req.body.file_departement)
      const fileFid = path.join(__dirname, '../../import/' + req.body.file_fid)

      const csv = require('csvtojson')
      csv()
        .fromFile(fileShop)
        .then((jsonObj)=>{
            jsonObj.forEach((val) => {
              val.week = req.body.week
              val.year = req.body.year

              var singleShopRecap = new ShopRecap(val)
              singleShopRecap.save(function (err, recap) {
                if (err) {
                  console.log({
                    error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                    magasin: val.shop
                  })
                }
                console.log(recap)
              })
            })
          return 'Shop import done'
        })
        .then((log1)=> {
          console.log(log1)
          csv()
            .fromFile(fileDpt)
            .then((jsonObj)=>{
                jsonObj.forEach((val) => {
                  val.week = req.body.week
                  val.year = req.body.year

                  var singleDptRecap = new DepartementRecap(val)
                  singleDptRecap.save(function (err, recap) {
                    if (err) {
                      console.log({
                        error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                        magasin: val.shop
                      })
                    }
                    console.log(recap)
                  })
                })
                return 'Département import done'
            })
            .then((log2)=> {
              console.log(log2)
              csv()
                .fromFile(fileFid)
                .then((jsonObj)=>{
                    jsonObj.forEach((val) => {
                      val.week = req.body.week
                      val.year = req.body.year
                      val.shop = val.Magasin

                      var singlefidRecap = new FideliteRecap(val)
                      singlefidRecap.save(function (err, recap) {
                        if (err) {
                          console.log({
                            error_msg: 'Une erreur est survenue lors de l\'enregistrement des récaps',
                            magasin: val.shop
                          })
                        }
                        console.log(recap)
                      })
                    })
                    return 'fidelite import done'
                })
                .then((log3)=> {
                  console.log(log3)
                  return log3
                }) 
            })
        })
        .then((val) => {
          console.log(val)
          res.redirect('/import/all')
        })
    } else {
      res.redirect('/')  
    }
  },

}

module.exports = importCtrl
