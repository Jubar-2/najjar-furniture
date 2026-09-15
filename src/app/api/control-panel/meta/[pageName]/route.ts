import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import { getSitePage } from "@/lib/sitePages";
import { PageMetaSchema, readPageMetaFromJson } from "@/schemas/pageMeta.schema";

// PATCH /api/control-panel/meta/:pageName
// Updates the meta settings for a single page. Auto-creates the Page record
// if it doesn't exist yet. Only the fields actually sent are changed.
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/control-panel/meta/[pageName]">
) {
  try {
    const { pageName } = await params;

    const sitePage = getSitePage(pageName);
    if (!sitePage) {
      return NextResponse.json({ error: "Unknown page." }, { status: 404 });
    }

    const json = (await req.json()) as Record<string, unknown>;
    const raw = readPageMetaFromJson(json);

    const parsed = PageMetaSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { title, meta_title, meta_description, meta_keywords, meta_og_image, meta_author } =
      parsed.data;

    if (
      title === undefined &&
      meta_title === undefined &&
      meta_description === undefined &&
      meta_keywords === undefined &&
      meta_og_image === undefined &&
      meta_author === undefined
    ) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    await dbConnect();

    let page = await PageModel.findOne({ pageName });
    if (!page) {
      page = await PageModel.create({
        pageName,
        title: sitePage.defaultTitle,
        meta_title: sitePage.defaultTitle,
        meta_description: sitePage.defaultDescription,
        meta_keywords: sitePage.defaultKeywords,
      });
    }

    if (title !== undefined) page.title = title;
    if (meta_title !== undefined) page.meta_title = meta_title;
    if (meta_description !== undefined) page.meta_description = meta_description;
    if (meta_keywords !== undefined) page.meta_keywords = meta_keywords;
    if (meta_og_image !== undefined) page.meta_og_image = meta_og_image;
    if (meta_author !== undefined) page.meta_author = meta_author;

    await page.save();

    return NextResponse.json(
      {
        data: {
          pageName,
          title: page.title,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          meta_keywords: page.meta_keywords,
          meta_og_image: page.meta_og_image,
          meta_author: page.meta_author,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /control-panel/meta/:pageName failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}