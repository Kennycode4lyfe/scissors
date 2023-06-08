const express = require("express");
const passport = require("passport");
const isUrlHttp = require('is-url-http')
const cloudinary = require("cloudinary").v2;

const qrCode = require("../qrcode");
const userController = require("../controllers/userController");
const userModel = require("../models/user");
const urlModel = require("../models/url");
const urlRouter = express.Router();

urlRouter.get("/home", async (req, res) => {
try{
res.render("url",{shortUrl:{
short:null
}});
}catch{
  res.status(404).json({message:'page not found'})
}

});

urlRouter.post("/shortUrl", async (req, res) => {
  try{
    const newUrlPayLoad = req.body;
    const user = await userModel.findOne({ username: req.user.username });
    if(isUrlHttp(newUrlPayLoad.full)==false){
      res.status(403).render("url",{shortUrl:{short:'long url is not a valid url'}})
    }else{
    const shortUrl = await urlModel.create({
      user: user._id,
      full: newUrlPayLoad.full,
      short: newUrlPayLoad.short,
    });
    const urlQrCode = await qrCode.generateQrCode(shortUrl.short, req.user);
    const updatedUrl = await urlModel.findOneAndUpdate(
      { _id: shortUrl._id },
      { qrLink: urlQrCode.secure_url },
      { new: true }
    );
    
    const shortUrlLink = req.headers.host +'/shortUrl' + '/' + updatedUrl.short
    console.log(shortUrlLink)
    res.status(200).render('url',{shortUrl:{short:shortUrlLink,
    urlDetails:updatedUrl}
    })
    console.log(updatedUrl);
  }}catch(err){
    res.sendStatus(500).json({message:err.message})
  }
});



urlRouter.delete("/urls", async (req, res) => {
  try{
    await urlModel.deleteMany();
    res.status(200).json({ message: "all urls deleted" });
  }catch(err){
    console.log(err.message)
    res.status(500).json({'message':err.message})
  }

});

urlRouter.delete("/shortUrl/:url", async (req, res) => {
  try{
  const urlParam = req.params.url
  console.log(typeof(urlParam))
  const urlToDelete = await urlModel.findOne({short:urlParam})
  await cloudinary.uploader.destroy(urlToDelete.full)
  console.log('about to delete')
  await urlModel.deleteOne({short:urlParam})
  res.status(200).json({ message: "url deleted" });
  }catch(err){
  res.status(500).json({message:err.message})
  }
});

urlRouter.get("/shortUrl/:url", async (req, res) => {
try{
  const shortUrl = await urlModel.findOne({ short: req.params.url })
  console.log(shortUrl)
  if (shortUrl == null) return res.sendStatus(404).json({message:'url not found'})
  shortUrl.clicks++
  shortUrl.save()
  res.status(200).redirect(shortUrl.full)
}catch(err){
res.status(500).json({message:err.message})
}
});

urlRouter.get("/urls", async (req, res) => {
  try{
  const username = req.user.username;
  const hostname = req.headers.host
  console.log(username)
  const user = await userModel.findOne({ username: username });
  const userUrls = await urlModel.find({ user: user._id }).populate("user");
  if(!userUrls){
    res.sendStatus(404).json({message:'url not found'})
  }else{
    res.status(200).render("analytics", { userUrls: {
      urlDetails:userUrls,
      hostname:hostname
    } });
  }
 
}catch(err){
  if(err){
  res.status(500).json({ message: "error" });
  }
}
});

urlRouter.get("/qrcode/:link", async (req, res) => {
  try{
  const shortLink = req.params.link;
console.log(shortLink)
  const userUrl = await urlModel.findOne({ short:shortLink })
  console.log(userUrl)
  res.status(200).render("qrcode", { userUrls: userUrl });
}catch(err){
  if(err){
  console.log(err)
  res.json({ message: err.message });
  }
}
});

module.exports = urlRouter;
