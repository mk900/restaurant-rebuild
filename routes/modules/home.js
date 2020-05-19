const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Home page
router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = router