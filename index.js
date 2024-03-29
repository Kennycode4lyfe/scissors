const express = require('express')
const app = express()
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const userRoute = require('./routes/userRoutes')
const urlRoute = require('./routes/urlRoutes')
const {Redis} = require('./saveToRedis')
const connectRedis = new Redis
require('dotenv').config()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));
connectRedis.connectToRedis()
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(passport.initialize())
app.use(passport.session())
require('./passport')
app.get('/', (req, res) => {
    // console.log(req.user)
    if(req.user){
      res.render('url')
    }else{
    res.render('index')
}  })
app.use('/',userRoute)
app.use('/',urlRoute)



module.exports = app