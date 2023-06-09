const express = require("express");
const passport = require("passport");
const isUrlHttp = require('is-url-http')
const cloudinary = require("cloudinary").v2;

const qrCode = require("../qrcode");
const urlController = require('../controllers/urlController')
const userController = require("../controllers/userController");
const userModel = require("../models/user");
const urlModel = require("../models/url");
const urlRouter = express.Router();
const sessionChecker = require('../sessionCheckmiddleware')

urlRouter.get("/home",sessionChecker.checkSession, urlController.home);

urlRouter.post("/shortUrl",sessionChecker.checkSession,urlController.postUrlDetails);

urlRouter.delete("/urls",sessionChecker.checkSession,urlController.deleteUrls);

urlRouter.delete("/shortUrl/:url",sessionChecker.checkSession,urlController.deleteUrl);

urlRouter.get("/shortUrl/:url",sessionChecker.checkSession,urlController.getUrl);

urlRouter.get("/urls",sessionChecker.checkSession,urlController.getAllUrls);

urlRouter.get("/qrcode/:link",sessionChecker.checkSession,urlController.getQrcode);

module.exports = urlRouter;
