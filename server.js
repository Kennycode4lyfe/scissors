const express = require('express')
const app = express()
const passport = require('passport')
const helmet = require('helmet')
const rateLimit = require("express-rate-limit");
const database = require('./database/db')
const bodyParser = require('body-parser')
const session = require('express-session')
const userRoute = require('./routes/userRoutes')
const urlRoute = require('./routes/urlRoutes')
const {Redis} = require('./saveToRedis')
// create a new instance of Redis class
const connectRedis = new Redis
require('dotenv').config()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


app.use(express.static(__dirname + '/public'));

//connect to mongoDB database
database.connectToDb()

//connect to redis server
connectRedis.connectToRedis()

//enable session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

//initialize passport
app.use(passport.initialize())

//integrate session in passport
app.use(passport.session())

require('./middleware/passport')

app.get('/', (req, res) => {
    // console.log(req.user)
    if(req.user){
      res.render('url') 
    }else{
    res.render('index')
}  })

//configure rate limiting middleware
const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//add secuirty
app.use(helmet({contentSecurityPolicy: false}))


// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use('/',userRoute)
app.use('/',urlRoute)



app.listen(process.env.PORT|| 5000)