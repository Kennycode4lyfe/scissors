const mongoose = require('mongoose')

// use dotenv to access link url to database
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;


const connectToDb = function(){

// connect to database with link url
    mongoose.connect(MONGODB_URL);


    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB Successfully");
    });
    
// log error to console when connection to database fails
    mongoose.connection.on("error", (err) => {
      console.log("An error occurred while connecting to MongoDB");
      console.log(err);
    });

}

module.exports = {connectToDb}