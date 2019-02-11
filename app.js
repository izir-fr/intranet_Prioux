require('dotenv').config()

var bodyParser = require('body-parser')
var express = require('express')
var helmet = require('helmet')
var path = require('path')
var cookieParser = require('cookie-parser')
var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')
var mongoose = require('mongoose')

// Init App
var app = express()
var port = 3000

// Credentials
var credentials = require('./app/config/credentials')

// MongoDB
mongoose.Promise = require('bluebird')
mongoose.connect(credentials.mLab, { useNewUrlParser: true })

// Handlebars
var hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials',
  helpers: require('./custom_modules/handlebarsHelpers')
})

app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, '/app/views/'))
app.set('view engine', 'handlebars')

// Helmet
app.use(helmet())

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({ type: 'text/html', defaultCharset: 'utf-8' }))
app.use(cookieParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'assets/public')))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}))

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Connect Flash
app.use(flash())

// forestadmin
app.use(require('forest-express-mongoose').init({
  modelsDir: __dirname + '/app/models',
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  mongoose: require('mongoose')
}))

// Global Vars
app.use(function (req, res, next) {
  res.locals.password = req.session.password
  res.locals.localhost = process.env.LOCAL === 'true'
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.info_msg = req.flash('info_msg')
  res.locals.user = req.user || null
  res.locals.session = req.session
  next()
})

app.use('/', require('./app/router/cmsRoutes'))
app.use('/compteurs/', require('./app/router/compteursRoutes'))
app.use('/championnat/', require('./app/router/championnatRoutes'))
app.use('/import/', require('./app/router/importRoutes'))
app.use('/cumul/', require('./app/router/cumulRoutes'))

// 404
app.use(function (req, res, next) {
  res.status(404)

  // respond with html page
  if (req.accepts('html')) {
    res.render('partials/404', { url: req.url })
    return
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

// Set Port
app.set('port', (process.env.PORT || port))

app.listen(app.get('port'), function () {
  console.log('mongoose connect : ' + credentials.mLab)
  console.log('<==========')
  console.log('app on : localhost:' + app.get('port'))
  console.log('==========>')
})

module.exports = app
