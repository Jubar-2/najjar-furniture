import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/services/googleReviewsCache.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/google-reviews
// Returns Google Business reviews using server-side in-memory caching and single-flight deduplication.
export async function GET() {
  try {
    const data = await getGoogleReviews();

    return NextResponse.json(
      {
        success: true,
        cached: data.cached,
        cacheTtlSeconds: data.cacheTtlSeconds,
        placeTitle: data.placeTitle,
        totalReviews: data.totalReviews,
        reviews: data.reviews,
      },
      {
        status: 200,
        headers: {
          // Instruct browsers and edge caches to reuse response
          "Cache-Control": `public, max-age=${Math.min(data.cacheTtlSeconds, 3600)}, s-maxage=${data.cacheTtlSeconds}`,
        },
      }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve Google reviews";
    console.error("[API] GET /api/google-reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        cached: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

