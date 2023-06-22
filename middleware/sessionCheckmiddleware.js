module.exports.checkSession = (req,res,next)=>{
  console.log(req.user)
  //check if username is stored in session storage
    if(req.user){
      next()
    }else{
      res.redirect('/')
    }
    }