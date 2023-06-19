const { createClient } = require("redis");
const client = createClient();

class Redis {
  async connectToRedis(){

    client.on("error", (err) => console.log("Redis Client Error", err));
    client.on('connect',()=>console.log('connected to redis server'))
   await client.connect()


}

  async setCache(key,value){
    await client.lPush(key,value)
    console.log('cache hit')

  }

  
  async getCache(key){
   const urlDetails = await client.get(key)
    console.log('cache hit')
    return urlDetails

  }
  async deleteCache(key){
    await client.del(key)
  }

async deleteAllCache(){
  await client.flushAll()
}

}


module.exports = {Redis}
