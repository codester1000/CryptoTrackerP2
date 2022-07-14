const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/users.js')

const userRouter = express.Router()

userRouter.get('/signup', (req, res) => {
  res.render('signup.ejs' , {
    tabTitle: 'Signup',
    baseUrl: req.baseUrl,
    currentUser: '',
  })
})
userRouter.post('/', (req, res) => {
  console.log(req.body.password)
  console.log(req.body.image)
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  )
  console.log(req.body.image)
  User.create(req.body)
    .then((newUser) => {
      console.log('created user:', newUser)
      res.redirect('/login')
      req.session.currentUser = newUser
    })
    .catch((err) => {
      req.flash('info', 'Username Already Exists')
      res.redirect('/dashboard')
    })
})

// Login
userRouter.get('/login', (req, res) => {
  res.render('login.ejs', {
    tabTitle: 'Log In',
    baseUrl: req.baseUrl,
    currentUser: req.session.currentUser,
  })
})
userRouter.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if(!user) {
        req.flash('error', 'Incorrect Username or Password')
        return res.redirect('/login')
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.currentUser = user
        res.redirect('/dashboard')
      } else {
        req.flash('error', 'Incorrect Username or Password')
        res.redirect('/login')
      }
    })
})
userRouter.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })

})

module.exports = userRouter