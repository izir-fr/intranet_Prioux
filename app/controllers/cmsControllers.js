// Controllers
var cmsCtrl = {
  index: function (req, res) {
    res.render('partials/index')
  },
  robots: (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");    
  }
}

module.exports = cmsCtrl
