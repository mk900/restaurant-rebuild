// Include packages
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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

// Load static data
// const restaurantList = require('./restaurant.json')

// Connect DB
mongoose.connect('mongodb://localhost/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', () => {
  console.log('db error')
})
db.once('open', () => {
  console.log('db connected!')
})

// Load restaurant model
const Restaurant = require('./models/restaurant')

// Set routing
// View all
app.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// Create new restaurant
app.get('/new', (req, res) => {
  res.render('new')
})
app.post('/new', (req, res) => {
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// View a restaurant
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Update a restaurant info
app.get('/edit/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
})
app.post('/edit/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//Delete a restaurant
app.post('/delete/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Search restaurant
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find()
    .lean()
    .then(restaurants => {
      const results = restaurants.filter(
        item =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.category.toLowerCase().includes(keyword.toLowerCase())
      )
      if (results.length > 0) {
        res.render('index', { restaurants: results, keyword: keyword })
      } else {
        res.render('nothing', { keyword: keyword })
      }
    })
    .catch(error => console.log(error))
})

// listen app
app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})