const fs = require("fs");
const QRCode = require("qrcode");
const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const userModel = require("./models/user");
const urlModel = require("./models/url");

//cloudinary Configuration

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports.generateQrCode = async (url, username) => {
  QRCode.toFile(
    `./qrcodes/${username}.png'`,
    url.full,
    {
      color: {
        dark: "#00F", // Blue dots
        light: "#0000", // Transparent background
      },
    },
    function (err) {
      if (err) throw err;
      console.log("qr-code generated");
    }
  );
  const cloudinaryResponse = await cloudinary.uploader.upload(
    `./qrcodes/${username}.png'`,
    {
      folder: "linkQRcodes",
      public_id: url.short,
    }
  );

  fs.unlink(`./qrcodes/${username}.png'`, (err) => {
    if (err) return;
  });
  return cloudinaryResponse;
};
