const { createClient } = require("redis");
require("dotenv").config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "default";
const REDIS_USERNAME = process.env.REDIS_USERNAME;

const client = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

class Redis {
  async connectToRedis() {
    client.on("error", (err) => console.log("Redis Client Error", err));
    client.on("connect", () => console.log("connected to redis server"));
    await client.connect();
  }

  async setCache(key, value) {
    await client.set(key, value);
    console.log("cache hit");
  }

  async getCache(key) {
    const urlDetails = await client.get(key);
    console.log("cache hit");
    return urlDetails;
  }
  async deleteCache(key) {
    await client.del(key);
  }

  async deleteAllCache() {
    await client.flushAll();
  }
}

module.exports = { Redis };
