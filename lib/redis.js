// lib/redis.js - Upstash Redis client with 5-variant credential checking
import { Redis } from '@upstash/redis';

let redisInstance = null;
let checked = false;

export function getRedisClient() {
  if (checked) return redisInstance;
  checked = true;

  // 1. Standard Upstash Redis
  const url1 = process.env.UPSTASH_REDIS_REST_URL;
  const token1 = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url1 && token1) {
    redisInstance = new Redis({ url: url1, token: token1 });
    return redisInstance;
  }

  // 2. Vercel KV
  const url2 = process.env.KV_REST_API_URL;
  const token2 = process.env.KV_REST_API_TOKEN;
  if (url2 && token2) {
    redisInstance = new Redis({ url: url2, token: token2 });
    return redisInstance;
  }

  // 3. STORAGE_REST_API
  const url3 = process.env.STORAGE_REST_API_URL;
  const token3 = process.env.STORAGE_REST_API_TOKEN;
  if (url3 && token3) {
    redisInstance = new Redis({ url: url3, token: token3 });
    return redisInstance;
  }

  // 4. STORAGE_KV_REST_API
  const url4 = process.env.STORAGE_KV_REST_API_URL;
  const token4 = process.env.STORAGE_KV_REST_API_TOKEN;
  if (url4 && token4) {
    redisInstance = new Redis({ url: url4, token: token4 });
    return redisInstance;
  }

  // 5. UPSTASH_REDIS_KV_REST_API (Specific Vercel integration variant)
  const url5 = process.env.UPSTASH_REDIS_KV_REST_API_URL;
  const token5 = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;
  if (url5 && token5) {
    redisInstance = new Redis({ url: url5, token: token5 });
    return redisInstance;
  }

  return null;
}
