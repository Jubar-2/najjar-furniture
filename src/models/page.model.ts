import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
    title: string;
    pageName: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_og_image: string;
    meta_author: string;
}

const PageSchema = new Schema<IPage>(
    {
        title: {
            type: String,
            maxlength: 255,
        },
        pageName: {
            type: String,
            unique: true,
            required: true,
        },
        meta_title: {
            type: String,
            maxlength: 255,
        },
        meta_description: {
            type: String,
        },
        meta_keywords: {
            type: String,
        },
        meta_og_image: {
            type: String,
        },
        meta_author: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

PageSchema.index({ pageName: 1 });

// -------------------- Model Export --------------------
const PageModel =
    mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export default PageModel;