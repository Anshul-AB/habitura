require("dotenv").config();

const Redis = require("ioredis");

const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : process.env.IS_DOCKER === "true"
    ? process.env.REDIS_CONTAINER
    : "redis://localhost:6379";

// Set up Redis connection
const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("Connected to Redis", redisUrl);
});

redis.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
  console.log("Redis host:", redisUrl);
});

module.exports = redis;
