const { createClient } = require("redis");
const client = createClient();

// use dotenv to access link url to database
require("dotenv").config();




const connectToRedis = async function(){

    client.on("error", (err) => console.log("Redis Client Error", err));
    client.on('connect',()=>console.log('connected to redis server'))
   await client.connect()


}

module.exports = {connectToRedis}