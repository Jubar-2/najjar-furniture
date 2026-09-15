import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import { SITE_PAGES } from "@/lib/sitePages";

// GET /api/control-panel/meta
// Returns the meta settings (title, meta description, keywords, og image,
// author) for every public page. Pages that don't have a Page record yet
// come back with their defaults so the editor always shows a complete list.
export async function GET() {
  try {
    await dbConnect();

    const pages = await PageModel.find({
      pageName: { $in: SITE_PAGES.map((p) => p.pageName) },
    }).lean();

    const storedMap = new Map<string, (typeof pages)[number]>();
    for (const page of pages) storedMap.set(page.pageName, page);

    const data = SITE_PAGES.map((sitePage) => {
      const stored = storedMap.get(sitePage.pageName);
      return {
        pageName: sitePage.pageName,
        route: sitePage.route,
        label: sitePage.label,
        title: stored?.title ?? sitePage.defaultTitle,
        meta_title: stored?.meta_title ?? sitePage.defaultTitle,
        meta_description: stored?.meta_description ?? sitePage.defaultDescription,
        meta_keywords: stored?.meta_keywords ?? sitePage.defaultKeywords,
        meta_og_image: stored?.meta_og_image ?? "",
        meta_author: stored?.meta_author ?? "Najjar Furniture",
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /control-panel/meta failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}