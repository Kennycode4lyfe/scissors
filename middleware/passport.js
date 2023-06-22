const passportCustomStrategy = require('passport-custom').Strategy
const userModel = require('../models/user')
const passport = require('passport')

//create custom strategy with passport 
passport.use('checkUser', new passportCustomStrategy(
 async function(req, callback) {
     const userExist = await userModel.findOne({username:req.body.username})
    if(userExist){
      callback(null,{username:userExist.username});
    }else{
    const createUser = await userModel.create({username:req.body.username})
    callback(null, {username:createUser.username});
    }
  }
));


//determine what to store in session
passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user}`);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log(`deserializeUser ${user}`);
  cb(null, user);
});


