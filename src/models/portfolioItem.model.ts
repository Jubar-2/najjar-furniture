import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubImage {
  url: string;
  publicId?: string;
}

export interface IPortfolioItem extends Document {
  title: string;
  category?: string;
  description: string;
  image: string;
  imagePublicId: string;
  subImages?: ISubImage[];
  createdAt: Date;
  updatedAt: Date;
}

const portfolioItemSchema = new Schema<IPortfolioItem>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    subImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PortfolioItem: Model<IPortfolioItem> =
  mongoose.models.PortfolioItem ||
  mongoose.model<IPortfolioItem>("PortfolioItem", portfolioItemSchema);

export default PortfolioItem;