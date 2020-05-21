const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

const sortList = [
  {
    id: 0,
    name: 'A-Z',
    type: 'name',
    value: 'asc'
  },
  {
    id: 1,
    name: 'Z-A',
    type: 'name',
    value: 'desc'
  },
  {
    id: 2,
    name: '類別',
    type: 'category',
    value: 'asc'
  },
  {
    id: 3,
    name: '地區',
    type: 'location',
    value: 'asc'
  },
  {
    id: 4,
    name: '評分-升冪',
    type: 'rating',
    value: 'asc'
  },
  {
    id: 5,
    name: '評分-降冪',
    type: 'rating',
    value: 'desc'
  }
]

// Home page
// router.get('/', (req, res) => {
//   return Restaurant.find()
//     .lean()
//     .then(restaurants => res.render('index', { restaurants }))
//     .catch(error => console.log(error))
// })

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

router.get('/', (req, res) => {
  const keyword = req.query.keyword   // 存入keyword
  const sortId = req.query.sortId || 0    // 存入sort 類型
  const sort = sortList[Number(sortId)]
  const sortOption = { [sort.type]: [sort.value] }
  // 篩選&編排資料
  Restaurant.find()
    .sort(sortOption)
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // 搜尋篩選
      if (keyword) {
        restaurants = restaurants.filter(
          item =>
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.category.toLowerCase().includes(keyword.toLowerCase())
        )
      }
      return res.render('index', { sortId, keyword, sortList, restaurants })
    })
})

module.exports = router