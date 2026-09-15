import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  avatar: string;
  avatarPublicId: string;
  name: string;
  location: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    avatar: {
      type: String,
    },
    avatarPublicId: {
      type: String,
    },
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds + auto-manages createdAt / updatedAt
  }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;