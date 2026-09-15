import mongoose, { Schema, Document, Model } from "mongoose";
import type { ContactMessageStatus } from "@/schemas/contact.schema";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  topic: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);

export default ContactMessage;