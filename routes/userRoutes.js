const express= require('express')
const passport = require('passport')
const userController = require('../controllers/userController')
const userRouter = express.Router()

//user route
userRouter.post('/user',passport.authenticate('checkUser',{session:true}),userController.signup)

module.exports = userRouter