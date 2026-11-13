import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import { SITE_PAGES } from "@/lib/sitePages";
import {
  GoogleVerificationSchema,
  sanitizeGoogleVerificationCode,
} from "@/schemas/pageMeta.schema";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * GET /api/control-panel/seo-settings
 * Returns the site-wide SEO settings, including Google Search Console verification code.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return ApiResponse.error("Unauthorized. Please log in.", 401);
    }

    await dbConnect();

    // The primary canonical record for site-wide settings is the 'home' page.
    const homePage = await PageModel.findOne({ pageName: "home" })
      .select("google_site_verification")
      .lean();

    let code = homePage?.google_site_verification?.trim() || "";

    // Fallback if saved under another page
    if (!code) {
      const anyPage = await PageModel.findOne({
        google_site_verification: { $exists: true, $ne: "" },
      })
        .select("google_site_verification")
        .lean();
      code = anyPage?.google_site_verification?.trim() || "";
    }

    return ApiResponse.success({
      google_site_verification: code,
    });
  } catch (error) {
    console.error("GET /api/control-panel/seo-settings error:", error);
    return ApiResponse.fatal("Failed to load SEO settings.");
  }
}

/**
 * PATCH /api/control-panel/seo-settings
 * Updates the site-wide Google Search Console verification code.
 * Sanitizes raw HTML meta tags or tokens, validates, updates the database,
 * and clears server caches.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return ApiResponse.error("Unauthorized. Please log in.", 401);
    }

    const body = (await req.json()) as Record<string, unknown>;
    const parsed = GoogleVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error),
      );
    }

    const rawInput = parsed.data.google_site_verification;
    const sanitizedCode = sanitizeGoogleVerificationCode(rawInput);

    await dbConnect();

    // Persist to canonical 'home' page document
    let homePage = await PageModel.findOne({ pageName: "home" });

    if (!homePage) {
      homePage = await PageModel.create({
        pageName: "home",
        title: "Najjar Furniture – Timeless Furniture, Thoughtfully Crafted",
        google_site_verification: sanitizedCode,
      });
    } else {
      homePage.google_site_verification = sanitizedCode;
      await homePage.save();
    }

    // Revalidate public page caches so the meta tag is updated immediately
    try {
      revalidateTag("site-google-verification", "max");
      revalidateTag("page-meta", "max");
      for (const sitePage of SITE_PAGES) {
        revalidateTag(`page-meta-${sitePage.pageName}`, "max");
        if (sitePage.route) {
          revalidatePath(sitePage.route);
        }
      }
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.error("Failed to revalidate cache after SEO update:", revalErr);
    }

    return ApiResponse.success(
      {
        google_site_verification: sanitizedCode,
      },
      "Google Search Console verification code updated successfully.",
    );
  } catch (error) {
    console.error("PATCH /api/control-panel/seo-settings error:", error);
    return ApiResponse.fatal("Failed to save SEO settings.");
  }
}
