// lib/orderStore.js - Order persistence using Upstash Redis hash with in-memory fallback
import { getRedisClient } from './redis';
import { REPLY } from '@/config/site';

const PREFIX = (REPLY.orderPrefix || 'th').toLowerCase();
const HASH_KEY = `${PREFIX}:orders`;

// In-memory fallback if Redis is unconfigured
// Shared on globalThis so every route in one process sees the same orders when Redis is not configured (local development).
const memoryOrders = globalThis.__thMemoryOrders || (globalThis.__thMemoryOrders = new Map());

export async function saveOrder(order) {
  const redis = getRedisClient();
  const id = order.id || order.ref;
  const enriched = {
    ...order,
    id,
    ref: id,
    status: order.status || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    try {
      await redis.hset(HASH_KEY, { [id]: JSON.stringify(enriched) });
    } catch (err) {
      console.warn('[orderStore] Redis write error, falling back to memory:', err);
      memoryOrders.set(id, enriched);
    }
  } else {
    memoryOrders.set(id, enriched);
  }

  return enriched;
}

export async function listOrders() {
  const redis = getRedisClient();
  let orders = [];

  if (redis) {
    try {
      const data = await redis.hgetall(HASH_KEY);
      if (data) {
        orders = Object.values(data).map((item) => (typeof item === 'string' ? JSON.parse(item) : item));
      }
    } catch (err) {
      console.warn('[orderStore] Redis read error, using memory:', err);
      orders = Array.from(memoryOrders.values());
    }
  } else {
    orders = Array.from(memoryOrders.values());
  }

  // Sort descending by createdAt
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrder(id) {
  if (!id) return null;
  const redis = getRedisClient();

  if (redis) {
    try {
      const item = await redis.hget(HASH_KEY, id);
      if (item) {
        return typeof item === 'string' ? JSON.parse(item) : item;
      }
    } catch (err) {
      console.warn('[orderStore] Redis get error:', err);
    }
  }

  return memoryOrders.get(id) || null;
}

export async function markOrderSent(id, parsedPaymentFields = null) {
  const order = await getOrder(id);
  if (!order) return null;

  const updated = {
    ...order,
    status: 'details-sent',
    paymentDetailsSentAt: new Date().toISOString(),
    parsedPaymentFields: parsedPaymentFields || order.parsedPaymentFields,
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(updated);
}

export async function markPaymentConfirmed(id, receiptInfo = null) {
  const order = await getOrder(id);
  if (!order) return null;

  const updated = {
    ...order,
    status: 'payment-received',
    paymentConfirmedAt: new Date().toISOString(),
    receiptInfo: receiptInfo || order.receiptInfo,
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(updated);
}

export async function deleteOrder(id) {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hdel(HASH_KEY, id);
    } catch (err) {
      console.warn('[orderStore] Redis delete error:', err);
    }
  }
  memoryOrders.delete(id);
  return { success: true };
}
