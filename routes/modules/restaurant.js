const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Create new restaurant
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/new', (req, res) => {
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// View a restaurant
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Update a restaurant info
router.get('/edit/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
})
router.put('/edit/:id', (req, res) => {    //RESTful
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(error => console.log(error))
})

// Delete a restaurant
router.delete('/delete/:id', (req, res) => {   //RESTful
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// // Search restaurant --> 移到 home.js
// router.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   return Restaurant.find()
//     .lean()
//     .then(restaurants => {
//       const results = restaurants.filter(
//         item =>
//           item.name.toLowerCase().includes(keyword.toLowerCase()) ||
//           item.category.toLowerCase().includes(keyword.toLowerCase())
//       )
//       if (results.length > 0) {
//         res.render('index', { restaurants: results, keyword: keyword })
//       } else {
//         res.render('nothing', { keyword: keyword })
//       }
//     })
//     .catch(error => console.log(error))
// })

module.exports = router