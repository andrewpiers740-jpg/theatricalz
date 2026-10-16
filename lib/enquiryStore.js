// lib/enquiryStore.js - Enquiries persistence using Upstash Redis hash with in-memory fallback
import { getRedisClient } from './redis';
import { REPLY } from '@/config/site';

const PREFIX = (REPLY.orderPrefix || 'th').toLowerCase();
const HASH_KEY = `${PREFIX}:enquiries`;

const memoryEnquiries = new Map();

export async function saveEnquiry(enquiry) {
  const redis = getRedisClient();
  const id = enquiry.id || `ENQ-${Date.now().toString(36).toUpperCase()}`;
  const enriched = {
    ...enquiry,
    id,
    status: enquiry.status || 'new',
    createdAt: enquiry.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    try {
      await redis.hset(HASH_KEY, { [id]: JSON.stringify(enriched) });
    } catch (err) {
      console.warn('[enquiryStore] Redis write error, falling back to memory:', err);
      memoryEnquiries.set(id, enriched);
    }
  } else {
    memoryEnquiries.set(id, enriched);
  }

  return enriched;
}

export async function listEnquiries() {
  const redis = getRedisClient();
  let enquiries = [];

  if (redis) {
    try {
      const data = await redis.hgetall(HASH_KEY);
      if (data) {
        enquiries = Object.values(data).map((item) => (typeof item === 'string' ? JSON.parse(item) : item));
      }
    } catch (err) {
      console.warn('[enquiryStore] Redis read error, using memory:', err);
      enquiries = Array.from(memoryEnquiries.values());
    }
  } else {
    enquiries = Array.from(memoryEnquiries.values());
  }

  return enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getEnquiry(id) {
  if (!id) return null;
  const redis = getRedisClient();

  if (redis) {
    try {
      const item = await redis.hget(HASH_KEY, id);
      if (item) {
        return typeof item === 'string' ? JSON.parse(item) : item;
      }
    } catch (err) {
      console.warn('[enquiryStore] Redis get error:', err);
    }
  }

  return memoryEnquiries.get(id) || null;
}

export async function markEnquiryReplied(id, replyDetails = null) {
  const enquiry = await getEnquiry(id);
  if (!enquiry) return null;

  const updated = {
    ...enquiry,
    status: 'replied',
    repliedAt: new Date().toISOString(),
    replyDetails: replyDetails || enquiry.replyDetails,
    updatedAt: new Date().toISOString(),
  };

  return saveEnquiry(updated);
}

export async function deleteEnquiry(id) {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hdel(HASH_KEY, id);
    } catch (err) {
      console.warn('[enquiryStore] Redis delete error:', err);
    }
  }
  memoryEnquiries.delete(id);
  return { success: true };
}
