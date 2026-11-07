if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import axios, { AxiosError, AxiosInstance } from "axios";

export interface SerpApiReviewUser {
  name?: string;
  link?: string;
  thumbnail?: string;
  reviews?: number;
}

export interface SerpApiReview {
  review_id: string;
  user?: SerpApiReviewUser;
  rating?: number;
  date?: string;
  iso_date?: string;
  snippet?: string;
  body?: string;
  extracted_snippet?: {
    original?: string;
  };
  link?: string;
}

export interface SerpApiPagination {
  next_page_token?: string;
  next?: string;
}

export interface SerpApiResponse {
  search_metadata?: {
    id?: string;
    status?: string;
    json_endpoint?: string;
  };
  place_info?: {
    title?: string;
    rating?: number;
    reviews?: number;
  };
  reviews?: SerpApiReview[];
  serpapi_pagination?: SerpApiPagination;
  error?: string;
}

export interface NormalizedGoogleReview {
  reviewId: string;
  reviewerName: string;
  reviewerProfileUrl?: string;
  reviewerAvatarUrl?: string;
  rating: number;
  comment: string;
  reviewTime: string;
  reviewUrl?: string;
}

export interface FetchReviewsResult {
  reviews: NormalizedGoogleReview[];
  pagesFetched: number;
  totalReviews: number;
  placeTitle?: string;
}

const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;

/**
 * Dedicated Axios instance for all SerpApi requests.
 * Configured with request timeout and standard JSON headers.
 */
export const serpApiClient: AxiosInstance = axios.create({
  baseURL: "https://serpapi.com",
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "User-Agent": "Najjar-Furniture/1.0",
  },
});

/**
 * Normalizes a raw SerpApi review object into a consistent client schema.
 */
export function normalizeSerpApiReview(
  raw: SerpApiReview,
): NormalizedGoogleReview | null {
  if (!raw || !raw.review_id || typeof raw.review_id !== "string") {
    return null;
  }

  const reviewerName = raw.user?.name?.trim() || "Google Customer";
  const reviewerProfileUrl = raw.user?.link || undefined;
  const reviewerAvatarUrl = raw.user?.thumbnail || undefined;

  // Extract text: snippet, body, or fallback
  const rawText =
    raw.snippet || raw.body || raw.extracted_snippet?.original || "";
  const comment = rawText.trim();

  // Extract rating (clamp 1 - 5, default 5)
  const numericRating = typeof raw.rating === "number" ? raw.rating : 5;
  const rating = Math.min(Math.max(Math.round(numericRating), 1), 5);

  // Extract ISO date
  let reviewTime = new Date().toISOString();
  if (raw.iso_date) {
    const parsed = new Date(raw.iso_date);
    if (!isNaN(parsed.getTime())) {
      reviewTime = parsed.toISOString();
    }
  }

  return {
    reviewId: raw.review_id,
    reviewerName,
    reviewerProfileUrl,
    reviewerAvatarUrl,
    rating,
    comment: comment || `Rated ${rating} out of 5 stars on Google`,
    reviewTime,
    reviewUrl: raw.link || undefined,
  };
}

/**
 * Fetches a single page of Google Maps reviews using Axios with exponential backoff.
 */
export async function fetchSerpApiPage(
  placeId: string,
  apiKey: string,
  nextPageToken?: string,
  retryCount = 0,
): Promise<SerpApiResponse> {
  const params: Record<string, string> = {
    engine: "google_maps_reviews",
    place_id: placeId,
    sort_by: "newestFirst",
    api_key: apiKey,
  };

  if (nextPageToken) {
    params.next_page_token = nextPageToken;
  }

  try {
    const response = await serpApiClient.get<SerpApiResponse>("/search.json", {
      params,
    });

    const data = response.data;

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`);
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<SerpApiResponse>;
      const status = axiosErr.response?.status;

      // Rate limited (429) or temporary 5xx server errors -> retry with exponential backoff
      if (
        (status === 429 ||
          (status && status >= 500) ||
          axiosErr.code === "ECONNABORTED") &&
        retryCount < MAX_RETRIES
      ) {
        const backoffDelay =
          Math.pow(2, retryCount) * 1000 + Math.random() * 500;
        console.warn(
          `[SerpApi] Axios request failed (${axiosErr.code || status}). Retrying in ${Math.round(
            backoffDelay,
          )}ms (attempt ${retryCount + 1}/${MAX_RETRIES})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return fetchSerpApiPage(placeId, apiKey, nextPageToken, retryCount + 1);
      }

      const errorMessage =
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        "Unknown network error from SerpApi";
      throw new Error(
        `SerpApi request failed with HTTP ${status || "unknown"}: ${errorMessage}`,
      );
    }

    throw error;
  }
}

/**
 * Fetches all available reviews for a Google Place ID by following pagination tokens.
 * Uses Axios exclusively and stops when no further pages or MAX_REVIEW_PAGES is reached.
 */
export async function fetchAllGoogleReviews(
  placeId: string,
  apiKey: string,
  options?: {
    maxPages?: number;
    delayBetweenPagesMs?: number;
  },
): Promise<FetchReviewsResult> {
  const maxPages =
    options?.maxPages ??
    (process.env.GOOGLE_REVIEW_MAX_PAGES
      ? parseInt(process.env.GOOGLE_REVIEW_MAX_PAGES, 10)
      : 20);
  const delayMs = options?.delayBetweenPagesMs ?? 600;

  const allReviews: NormalizedGoogleReview[] = [];
  const seenReviewIds = new Set<string>();
  const seenPageTokens = new Set<string>();

  let currentPageToken: string | undefined = undefined;
  let pagesFetched = 0;
  let placeTitle: string | undefined = undefined;

  console.info(
    `[SerpApi] Initiating review pagination (placeId: ${placeId}, maxPages: ${maxPages})`,
  );

  while (pagesFetched < maxPages) {
    pagesFetched++;

    const response = await fetchSerpApiPage(placeId, apiKey, currentPageToken);

    if (response.place_info?.title && !placeTitle) {
      placeTitle = response.place_info.title;
    }

    const pageReviews = response.reviews ?? [];

    let newOnThisPage = 0;
    for (const rawReview of pageReviews) {
      const normalized = normalizeSerpApiReview(rawReview);
      if (normalized && !seenReviewIds.has(normalized.reviewId)) {
        seenReviewIds.add(normalized.reviewId);
        allReviews.push(normalized);
        newOnThisPage++;
      }
    }

    console.info(
      `[SerpApi] Page ${pagesFetched}: received ${pageReviews.length} reviews (${newOnThisPage} new). Total collected: ${allReviews.length}`,
    );

    const nextToken = response.serpapi_pagination?.next_page_token;

    // Stop conditions:
    // 1. No next token returned
    // 2. Next token has already been processed (cycle prevention)
    // 3. No reviews returned on current page
    if (
      !nextToken ||
      seenPageTokens.has(nextToken) ||
      pageReviews.length === 0
    ) {
      console.info(
        `[SerpApi] Pagination completed after ${pagesFetched} page(s).`,
      );
      break;
    }

    seenPageTokens.add(nextToken);
    currentPageToken = nextToken;

    // Respectful delay between pagination calls
    if (delayMs > 0 && pagesFetched < maxPages) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    reviews: allReviews,
    pagesFetched,
    totalReviews: allReviews.length,
    placeTitle,
  };
}
