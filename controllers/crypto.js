const express = require("express")
const router = express.Router()

const Crypto = require('../models/crypto')
const User = require('../models/users')


// const fetchCrypto = () => {
//   // name = name.toLowerCase()
//   const api = `https://api.coincap.io/v2/assets/bitcoin`
//   const results = fetch(api)
//     .then((crypto) => {
//       console.log(crypto)
//     })
// }

// const findAndDelete = () => {
//   for (let i = 0; i < data.length; i++) {
//     if()
//   }
// }

// Landing Page
router.get('/', (req, res) => {
  console.log(req.session.currentUser)
  Crypto.find()
    .exec()
    .then((cryptos) => {
      res.render('index.ejs', {
        allCryptos: cryptos,
        baseUrl: req.baseUrl,
        tabTitle: 'Lander',
      })
  })
})
// Home Dashboard
router.get('/dashboard', (req, res) => {
  Crypto.find()
  .exec()
  .then((cryptos) => {
    // fetchCrypto()
    res.render('dashboard.ejs', {
      allCryptos: cryptos,
      baseUrl: req.baseUrl,
      tabTitle: 'Dashboard',
      currentUser: req.session.currentUser,
      defaultImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
    })
  })
  .catch((err) => {
    console.log(err)
    res.redirect('/dashboard')
  })
})
// Create coin path
router.get('/add', (req, res) => {
  Crypto.find()
  .exec()
  .then((cryptos) => {
    res.render('add.ejs', {
      allCryptos: cryptos,
      baseUrl: req.baseUrl,
      tabTitle: 'Create',
      currentUser: req.session.currentUser,
      defaultImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"

    })
  })
  .catch((err) => {
    console.log(err)
    res.redirect('/dashboard')
  })
})
router.post('/dashboard', (req, res) => {
  Crypto
    .create(req.body)
    .then((newCrypto) => {
      // console.log('New coin created:', newCrypto)
      console.log(req.session.currentUser.name)
      return User.findByIdAndUpdate(
        req.session.currentUser.id,
        { $push: { coins: newCrypto }}
      )
      })
    .then(() => {
      console.log(req.session.currentUser)
      res.redirect('/dashboard')
    })
    // .then(close)
    .catch((err) => console.log('Error: ', err))
})

router.get("/edit/:id", (req, res) => {
  Crypto.findById(req.params.id)
    .exec()
    .then((coin) => {
      res.render('edit.ejs', {
        coin: coin,
        tabTitle:  `Edit - ${coin.name}`,
        baseUrl: req.baseUrl,
        id: coin.id,
        currentUser: req.session.currentUser,
        defaultImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
      })
    })
})
router.put('/:id', (req, res) => {
  if (req.body.amount <= 0) {
    Crypto.findByIdAndRemove(req.params.id)
    .exec()
    .then((coin) => {
      console.log('Deleted: ', coin)
      res.redirect('/dashboard')
      // return User.findByIdAndUpdate(
      //   req.session.currentUser.id,
      //   {}
      // )
    })

  } else {
  Crypto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
    .exec()
    .then((updatedCoin) => {
      console.log('Updated: ', updatedCoin)
      res.redirect('/dashboard')
    })
  }
})


module.exports = router
