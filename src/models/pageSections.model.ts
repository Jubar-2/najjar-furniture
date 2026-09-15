import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Matches the Postgres `type` column comment — keep this in sync with
// whatever section renderers you actually build. Using a string union
// (not a hard Mongoose `enum`) so adding a new section type later is a
// one-line change here, not a migration.
export type PageSectionType =
    | "banner"
    | "home-layer-3"
    | "home-layer-1"
    | "home-layer-2"
    | "gallery"
    | "portfolio"
    | "about"
    | "testimonials"
    | "privacy-policy"
    | "contact"

export interface IPageSection extends Document {
    pageId: Types.ObjectId;
    type: PageSectionType;
    orderIndex: number;
    isActive: boolean;
    content: Record<string, unknown>; // flexible payload — mirrors JSONB
    createdAt: Date;
    updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>(
    {
        pageId: {
            type: Schema.Types.ObjectId,
            ref: "Page",
            required: true,
            index: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
            // Remove this `enum` if you want type to stay fully free-form like
            // the Postgres VARCHAR(50) comment suggests (any string allowed).
            enum: ["banner", "home-layer-3", "home-layer-1", "home-layer-2", "gallery", "portfolio", "about", "testimonials", "privacy-policy", "contact"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        content: {
            type: Schema.Types.Mixed,
            required: true,
            default: {},
        },
    },
    {
        timestamps: true, // adds + auto-manages createdAt / updatedAt
    }
);

// Equivalent of: CREATE INDEX idx_page_sections_page_id_order ON page_sections(page_id, order_index);
PageSectionSchema.index({ pageId: 1, orderIndex: 1 });

// Postgres's `ON DELETE CASCADE` has no direct Mongoose equivalent —
// deleting a Page won't automatically delete its sections. Wire that up
// explicitly wherever you delete a Page, e.g.:
//
//   await PageSection.deleteMany({ pageId: page._id });
//   await page.deleteOne();
//
// or via a pre-hook on the Page schema if you prefer it centralized there.

const PageSection: Model<IPageSection> =
    mongoose.models.PageSection || mongoose.model<IPageSection>("PageSection", PageSectionSchema);

export default PageSection;