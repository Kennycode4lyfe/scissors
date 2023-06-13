const { createClient } = require("redis");
const client = createClient();

class Redis {
  

  async connect() {
    client.on("error", (err) => console.log("Redis Client Error", err));
    client.on('connect',()=>console.log('connected to redis server'))
    await client.connect()
  }

  async setCache(key,value){
    await client.set(key,value)
    console.log('cache hit')

  }

  
  async getCache(key){
   const urlDetails = await client.get(key)
    console.log('cache hit')
    return urlDetails

  }

async deleteAllCache(){
  await client.flushAll()
}

}


module.exports = {Redis}
