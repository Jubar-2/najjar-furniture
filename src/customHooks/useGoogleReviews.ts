import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface GoogleReview {
  reviewId: string;
  reviewerName: string;
  reviewerProfileUrl?: string;
  reviewerAvatarUrl?: string;
  rating: number;
  comment: string;
  reviewTime: string;
  reviewUrl?: string;
}

export interface GoogleReviewsApiResponse {
  success: boolean;
  cached: boolean;
  cacheTtlSeconds: number;
  placeTitle?: string;
  totalReviews: number;
  reviews: GoogleReview[];
}

export const GOOGLE_REVIEWS_QUERY_KEY = ["google-reviews"] as const;

/**
 * Dedicated React Query hook to fetch cached Google Business Reviews.
 * Uses Axios exclusively and calls Next.js internal GET /api/google-reviews.
 * Never exposes the SerpApi key to the client.
 */
export const useGetGoogleReviews = () => {
  return useQuery<GoogleReview[]>({
    queryKey: GOOGLE_REVIEWS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get<GoogleReviewsApiResponse>("/api/google-reviews");
      if (data && Array.isArray(data.reviews)) {
        return data.reviews;
      }
      return [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour client-side cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

