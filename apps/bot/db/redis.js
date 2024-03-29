const redis = require("redis");

const redisClient = redis.createClient({ url: process.env.REDIS_URI });

redisClient.on("connect", () => console.log(`Redis ready at ${process.env.REDIS_URI}`));

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

module.exports = redisClient;
