// Controllers
var cmsCtrl = {
  index: function (req, res) {
    res.render('partials/index')
  },
  robots: (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");    
  },
  login: (req, res) => {
    var password = req.body.password
    if (password === process.env.PASSWORD) {
      req.session.password = true
      res.redirect('/compteurs/shop')
    } else {
      console.log('KO')
      res.render('partials/index')
    }
  }
}

module.exports = cmsCtrl
