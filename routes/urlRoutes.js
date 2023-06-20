const express = require("express");
const urlController = require('../controllers/urlController')
const urlRouter = express.Router();
const sessionChecker = require('../middleware/sessionCheckmiddleware')

urlRouter.get("/home",sessionChecker.checkSession, urlController.home);

urlRouter.post("/shortUrl",sessionChecker.checkSession,urlController.postUrlDetails);

urlRouter.delete("/urls",sessionChecker.checkSession,urlController.deleteUrls);

urlRouter.delete("/shortUrl/:url",sessionChecker.checkSession,urlController.deleteUrl);

urlRouter.get("/shortUrl/:url",sessionChecker.checkSession,urlController.getUrl);

urlRouter.get("/urls",sessionChecker.checkSession,urlController.getAllUrls);

urlRouter.get("/qrcode/:link",sessionChecker.checkSession,urlController.getQrcode);

module.exports = urlRouter;
