const express = require("express")
const router = express.Router()

const Crypto = require('../models/crypto')

router.get('/', (req, res) => {
  Crypto.find()
    .exec()
    .then((cryptos) => {
      res.render('index.ejs', {
        allCryptos: cryptos,
        baseUrl: req.baseUrl,
        tabTitle: 'Cryptos',
        currentUser: 'Current User'
      })
  })
    .catch((err) => {
      console.log(err)
      res.redirect('/login')
    })
})

module.exports = router
