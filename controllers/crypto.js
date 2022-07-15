const express = require("express")
const router = express.Router()

const Crypto = require('../models/crypto')
const User = require('../models/users')
let pricesArray = null;
let sum = 0;


const sumUp = (pricesArray, allCryptos) => {
  sum = 0;
  for (let i=0; i < pricesArray.length; i++) {
    let num = pricesArray[i]
    num = num*allCryptos[i].amount
    sum = num + sum
  }
  return sum
}

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
    .then((coins) => {
      //this fetches the value of all the coins in real time
      pricesArray = []
      let thing = ''
      const api = `https://api.coincap.io/v2/assets`
      const results = fetch(api)
        .then((res) => res.json())
        .then((cryptos) => {
          for(let i=0; i < coins.length; i++) {
            for (let x=0; x < cryptos.data.length; x++) {
              if (cryptos.data[x].name == coins[i].coin) {
                console.log(coins[i].coin)
                pricesArray.push(parseFloat(cryptos.data[x].priceUsd).toFixed(2))
              }
            } 
          }
          sum = sumUp(pricesArray, coins)
        })
        .then(() => {
          res.render('dashboard.ejs', {
            prices: pricesArray,
            sum: sum,
            allCryptos: coins,
            baseUrl: req.baseUrl,
            tabTitle: 'Dashboard',
            currentUser: req.session.currentUser,
            // pricesArray: pricesArray,
            defaultImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
            })
        })
    }
    )
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
router.post('/:id', (req, res) => {
  Crypto
    .create(req.body)
    .then((newCrypto) => {
      console.log('New coin created:', newCrypto)
      // console.log(req.session.currentUser._id)
      res.redirect('/dashboard')
      return User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { coins: newCrypto._id }},
        { new: true, useFindAndModify: false }
      )
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
      User.findById(req.session.currentUser._id)
        .exec()
        .then((user) => {
          console.log(user)
          for(let i=0; i<user.coins.length; i++) {
            if(coin._id == user.coins[i]) {
              user.coins.slice(i, i+1)
            }
          }
        })
    })
    .then(res.redirect('/dashboard'))

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
