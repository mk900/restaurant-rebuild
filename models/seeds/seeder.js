const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const dataList = require('../../restaurant.json').results
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
  for (const item of dataList) {
    Restaurant.create(item)
  }
  console.log('done')
})
