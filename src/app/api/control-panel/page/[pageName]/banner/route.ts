import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  PageBannerUpdateSchema,
  readPageBannerFromFormData,
} from "@/schemas/pageBanner.schema";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import { ApiResponse } from "@/lib/apiResponse";
import { normalizePageName } from "@/lib/getPageBanner";
import { getSitePage } from "@/lib/sitePages";

// GET /api/control-panel/page/:pageName/banner
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const { pageName } = await params;
    const normalized = normalizePageName(pageName);

    await dbConnect();

    const page = await PageModel.findOne({
      pageName: { $in: [normalized, pageName] },
    });

    if (!page) {
      return ApiResponse.error("Page not found.", 404);
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: "banner",
    });

    if (!section) {
      return ApiResponse.error("Banner not found.", 404);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("GET /control-panel/page/:pageName/banner failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// PATCH /api/control-panel/page/:pageName/banner
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const { pageName } = await params;
    const normalized = normalizePageName(pageName);

    const formData = await req.formData();
    const raw = readPageBannerFromFormData(formData);

    const parsed = PageBannerUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { image, title, subtitle } = parsed.data;

    await dbConnect();

    let page = await PageModel.findOne({
      pageName: { $in: [normalized, pageName] },
    });

    if (!page) {
      const sitePage = getSitePage(normalized);
      page = await PageModel.create({
        pageName: normalized,
        title: sitePage?.defaultTitle ?? normalized,
      });
    }

    let section = await PageSection.findOne({
      pageId: page._id,
      type: "banner",
    });

    if (!section && !image) {
      return ApiResponse.error("A banner image is required to create this banner.", 400);
    }

    const updatedContent: Record<string, unknown> = section
      ? { ...section.content }
      : {};

    if (title !== undefined) updatedContent.title = title;
    if (subtitle !== undefined) updatedContent.subtitle = subtitle;

    if (image) {
      const imageCloud = await uploadOnCloudinary(image);
      if (!imageCloud) {
        return ApiResponse.error("Banner image upload failed.", 502);
      }

      const previousPublicId = (updatedContent as { imagePublicId?: string }).imagePublicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }

      updatedContent.image = imageCloud.secure_url;
      updatedContent.imagePublicId = imageCloud.public_id;
    }

    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: "banner",
        content: updatedContent,
      });
    } else {
      section.content = updatedContent;
      section.markModified("content");
      await section.save();
    }

    return ApiResponse.success(section, "Banner updated successfully.");
  } catch (error) {
    console.error("PATCH /control-panel/page/:pageName/banner failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
