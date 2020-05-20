// Include packages
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const routes = require('./routes')

// Setup server
const app = express()
const port = 3000

// Locate static file
app.use(express.static('public'))

// Set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// Use body parser
app.use(bodyParser.urlencoded({ extended: true }))

// Re-write for RESTful
app.use(methodOverride('_method'))

// Connect DB
// mongoose.connect('mongodb://localhost/restaurant', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// const db = mongoose.connection
// db.on('error', () => {
//   console.log('db error')
// })
// db.once('open', () => {
//   console.log('db connected!')
// })
require('./config/mongoose')

// Load restaurant model
const Restaurant = require('./models/restaurant')

// Express router
app.use(routes)

// listen app
app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})