const isUrlHttp = require("is-url-http");
const cloudinary = require("cloudinary").v2;
const qrCode = require("../qrcode");
const userModel = require("../models/user");
const urlModel = require("../models/url");
const {Redis} = require('../saveToRedis')


const saveToRedis = new Redis


//render home page
module.exports.home = async (req, res) => {
  try {
    res.render("url"
    , {
      shortUrl: {
        short: null,
      },
    }
    );
  } catch {
    res.status(404).json({ message: "page not found" });
  }
};

//create shortUrl
module.exports.postUrlDetails = async (req, res) => {
  try {
    const newUrlPayLoad = req.body;
    const user = await userModel.findOne({ username: req.user.username });
    if (isUrlHttp(newUrlPayLoad.full) == false) {
      res
        .status(403)
        .render("url", { shortUrl: { short: "long url is not a valid url" } });
    } else {
      const shortUrl = await urlModel.create({
        user: user._id,
        full: newUrlPayLoad.full,
        short: newUrlPayLoad.short,
      });
      const urlQrCode = await qrCode.generateQrCode(shortUrl, req.user);
      const updatedUrl = await urlModel.findOneAndUpdate(
        { _id: shortUrl._id },
        { qrLink: urlQrCode.secure_url },
        { new: true }
      );
      const savedUserUrls = await saveToRedis.deleteCache(`${req.user.username}:urls`)

      const shortUrlLink =
        req.headers.host + "/shortUrl" + "/" + updatedUrl.short;
      
      res
        .status(200)
        .render("url", {
          shortUrl: { short: shortUrlLink, urlDetails: updatedUrl },
        });

    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};


//delete all shortUrls
module.exports.deleteUrls = async (req, res) => {
  try {
    await urlModel.deleteMany();
    await saveToRedis.deleteAllCache()
    res.status(200).json({ message: "all urls deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};


//delete a shortUrl 
module.exports.deleteUrl = async (req, res) => {
  try {
    const urlParam = req.params.url;
    const urlToDelete = await urlModel.findOne({ short: urlParam });

    await cloudinary.uploader.destroy(urlToDelete.full);
    await saveToRedis.deleteAllCache()
    console.log("about to delete");
    await urlModel.deleteOne({ short: urlParam });
    res.status(200).json({ message: "url deleted" });
  }catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//redirect for shortUrl
module.exports.getUrl = async (req, res) => {
  try {
    
      const shortUrl = await urlModel.findOne({ short: req.params.url });
      if (shortUrl == null){
      return res.status(404).json({ message: "url not found" });}
      else{
        await saveToRedis.deleteCache(`${req.user.username}:urls`)
      shortUrl.clicks++;
      shortUrl.save();
      res.status(200).redirect(shortUrl.full);
      }

  } catch (err) {
    console.log(err)
    res.json({ message: err.message });
    res.end;
  }
};

//get all shortUrls created by the user
module.exports.getAllUrls = async (req, res) => {
  try {
    const savedUserUrls = await saveToRedis.getCache(`${req.user.username}:urls`)
    const hostname = req.headers.host;
    if(savedUserUrls){
      const parsedSavedUserUrls = JSON.parse(savedUserUrls)
      res.status(200).render("analytics", {
        userUrls: {
          urlDetails: parsedSavedUserUrls,
          hostname: hostname,
        },
      });
    }else{
      const username = req.user.username;
      const user = await userModel.findOne({ username: username });
      const userUrls = await urlModel.find({ user: user._id }).populate("user");
      await saveToRedis.setCache(`${req.user.username}:urls`,JSON.stringify(userUrls))
      if (!userUrls) {
        res.sendStatus(404).json({ message: "url not found" });
      } else {
        res.status(200).render("analytics", {
          userUrls: {
            urlDetails: userUrls,
            hostname: hostname,
          },
        });
      }
    }
  }catch (err) {
    if (err) {
      console.log(err)
      res.status(500).json({ message: "error" });
    }
  }
};

//render qr-code for the shortUrl
module.exports.getQrcode = async (req, res) => {
  try {
    const shortLink = req.params.link;
    const userUrl = await urlModel.findOne({ short: shortLink });
    res.status(200).render("qrcode", { userUrls: userUrl });
  } catch (err) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }
  }
};
