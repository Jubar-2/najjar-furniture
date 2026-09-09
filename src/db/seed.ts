import mongoose from "mongoose";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";

const seed = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URI!);

        await dbConnect();

        console.log("MongoDB connected",process.env.MONGODB_URI);

        // // Existing data remove করতে চাইলে
        // await UserModel.deleteMany({});
        const password = "Admin@123";
        const hashedPassword = await bcrypt.hash(password, 12);

        const users = [
            {
                email: "admin@gmail.com",
                password: hashedPassword
            }
        ];

        await UserModel.insertMany(users);

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Seed failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

seed();