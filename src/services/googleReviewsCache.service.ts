import { fetchAllGoogleReviews, type NormalizedGoogleReview } from "./serpApi.service";

export interface CachedReviewsData {
  reviews: NormalizedGoogleReview[];
  totalReviews: number;
  placeTitle?: string;
  fetchedAt: number;
  expiresAt: number;
}

export interface GoogleReviewsResponseData {
  success: boolean;
  cached: boolean;
  cacheTtlSeconds: number;
  reviews: NormalizedGoogleReview[];
  totalReviews: number;
  placeTitle?: string;
}

// In-memory cache and single-flight tracker attached to globalThis
// to ensure persistence across module re-evaluations within the same Node instance.
interface CacheContainer {
  cachedData: CachedReviewsData | null;
  inFlightPromise: Promise<CachedReviewsData> | null;
}

const globalCacheKey = "__googleReviewsCacheContainer__";
const globalContainer: CacheContainer = ((globalThis as unknown as Record<string, unknown>)[globalCacheKey] as CacheContainer) || {
  cachedData: null,
  inFlightPromise: null,
};
(globalThis as unknown as Record<string, unknown>)[globalCacheKey] = globalContainer;

/**
 * Returns the configured Cache TTL in seconds.
 * Production default: 86400 seconds (24 hours).
 * Testing: GOOGLE_REVIEWS_CACHE_TTL_SECONDS=1.
 */
export function getCacheTtlSeconds(): number {
  const envVal = process.env.GOOGLE_REVIEWS_CACHE_TTL_SECONDS;
  const parsed = Number(envVal);
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return 86400; // 24 hours default
}

/**
 * Retrieves Google reviews using server-side in-memory caching and a single-flight mutex.
 * 
 * - If cache is valid, returns immediately with `cached: true`.
 * - If cache is missing/expired, triggers a SerpApi fetch with `cached: false`.
 * - If multiple requests arrive concurrently during a cache miss, all await the single in-flight Promise.
 * - Does NOT cache unsuccessful responses.
 */
export async function getGoogleReviews(options?: {
  forceRefresh?: boolean;
}): Promise<GoogleReviewsResponseData> {
  const placeId = process.env.GOOGLE_REVIEW_PLACE_ID || "ChIJ_bHJ--0FLz4RwXN3oQ1Tbhw";
  const apiKey = process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY;
  const cacheTtlSeconds = getCacheTtlSeconds();
  const cacheTtlMs = cacheTtlSeconds * 1000;
  const now = Date.now();

  if (!apiKey) {
    throw new Error("SERPAPI_API_KEY or SERPAPI_KEY is not configured in environment variables.");
  }

  // 1. Return cached data if valid and not forcing a refresh
  if (
    !options?.forceRefresh &&
    globalContainer.cachedData &&
    now < globalContainer.cachedData.expiresAt
  ) {
    return {
      success: true,
      cached: true,
      cacheTtlSeconds,
      reviews: globalContainer.cachedData.reviews,
      totalReviews: globalContainer.cachedData.totalReviews,
      placeTitle: globalContainer.cachedData.placeTitle,
    };
  }

  // 2. Single-Flight Mechanism: if a fetch is already in flight, reuse its promise
  if (globalContainer.inFlightPromise) {
    console.info("[GoogleReviewsCache] Concurrent request detected; awaiting in-flight SerpApi promise...");
    const data = await globalContainer.inFlightPromise;
    return {
      success: true,
      cached: true,
      cacheTtlSeconds,
      reviews: data.reviews,
      totalReviews: data.totalReviews,
      placeTitle: data.placeTitle,
    };
  }

  // 3. Cache miss or expired: initiate fresh fetch
  console.info(`[GoogleReviewsCache] Cache ${globalContainer.cachedData ? "expired" : "miss"}. Fetching fresh reviews from SerpApi...`);

  globalContainer.inFlightPromise = (async () => {
    try {
      const result = await fetchAllGoogleReviews(placeId, apiKey);

      const newCache: CachedReviewsData = {
        reviews: result.reviews,
        totalReviews: result.totalReviews,
        placeTitle: result.placeTitle,
        fetchedAt: Date.now(),
        expiresAt: Date.now() + cacheTtlMs,
      };

      // Only cache upon successful response
      globalContainer.cachedData = newCache;
      return newCache;
    } catch (err) {
      // Do NOT cache unsuccessful responses
      console.error("[GoogleReviewsCache] Failed to fetch from SerpApi:", err);
      throw err;
    } finally {
      // Reset single-flight mutex
      globalContainer.inFlightPromise = null;
    }
  })();

  try {
    const freshData = await globalContainer.inFlightPromise;
    return {
      success: true,
      cached: false,
      cacheTtlSeconds,
      reviews: freshData.reviews,
      totalReviews: freshData.totalReviews,
      placeTitle: freshData.placeTitle,
    };
  } catch (error) {
    // If a previous stale cache exists, optionally log and fallback or re-throw
    if (globalContainer.cachedData) {
      console.warn("[GoogleReviewsCache] Serving stale cache due to refresh failure.");
      return {
        success: true,
        cached: true,
        cacheTtlSeconds,
        reviews: globalContainer.cachedData.reviews,
        totalReviews: globalContainer.cachedData.totalReviews,
        placeTitle: globalContainer.cachedData.placeTitle,
      };
    }
    throw error;
  }
}

/**
 * Resets the in-memory cache (primarily for unit tests).
 */
export function clearGoogleReviewsCache(): void {
  globalContainer.cachedData = null;
  globalContainer.inFlightPromise = null;
}

