require('dotenv').config();

const Redis = require("ioredis");

const redisHost = process.env.NODE_ENV === 'production' ? process.env.REDIS_HOST : 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Set up Redis connection
const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

redis.on("connect", () => {
  console.log("Connected to Redis", redisHost);
});

redis.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
  console.log("Redis host:", redisHost);
});

module.exports = redis;
