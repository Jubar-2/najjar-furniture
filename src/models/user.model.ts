import mongoose, { Schema, Document, Types } from "mongoose";

// -------------------- Message Interface & Schema --------------------
export interface IMessage extends Document {
    content: string;
    createdAt: Date;
}

// -------------------- User Interface & Schema --------------------
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Types.DocumentArray<IMessage>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            match: [/.+\@.+\..+/, "Please use a valid email address"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        verifyCode: {
            type: String,
        },
        verifyCodeExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// -------------------- Model Export --------------------
const UserModel =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;