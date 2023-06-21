const express = require('express')
const app = express()
const passport = require('passport')
const rateLimit = require("express-rate-limit");
const database = require('./database/db')
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
database.connectToDb()
connectRedis.connectToRedis()
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(passport.initialize())
app.use(passport.session())
require('./middleware/passport')
app.get('/', (req, res) => {
    // console.log(req.user)
    if(req.user){
      res.render('url') 
    }else{
    res.render('index')
}  })

const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	max: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})





// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use('/',userRoute)
app.use('/',urlRoute)



app.listen(process.env.PORT|| 5000)