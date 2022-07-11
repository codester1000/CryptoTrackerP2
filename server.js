// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const session = require('express-session')
const flash = require('express-flash')
const mongoDBSession = require('connect-mongodb-session')



// const sessionsController = require('./controllers/sessions')
const cryptosController = require('./controllers/crypto')
// const membersController = require('./controllers/members')


const app = express()
const PORT = process.env.PORT
const dbURL = process.env.MONGODB_URL
const MongoDBStore = mongoDBSession(session)
const sessionStore = new MongoDBStore({
  uri: dbURL,
  collection: 'sessions'
})


const router = express.Router()

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)
app.use(flash())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));
app.use(methodOverride("_method"));
// read document for other peoples documentation

// this last (define your middleware last)
app.use('/', cryptosController)
// s


//              LISTENER

mongoose.connect(dbURL, () => {
  console.log('Connected to Goods db')
})

app.listen(PORT, () => {
  console.log(`Biscoff Bakery app listening on port: ${PORT}`)
})
