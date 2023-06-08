const express= require('express')
const passport = require('passport')
const userController = require('../controllers/userController')
const userRouter = express.Router()


userRouter.post('/user',passport.authenticate('checkUser',{session:true}),userController.signup)

module.exports = userRouter