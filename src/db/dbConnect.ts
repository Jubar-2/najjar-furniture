import "dotenv/config";
import mongoose, { Mongoose } from "mongoose";

// Define the shape of our connection cache
interface ConnectionObject {
  isConnected?: number;
}

// Global connection cache for development (prevents multiple connections)
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

  if (connection.isConnected) {
    console.log("[MongoDB] Already connected");
    return;
  }

  const uri: string | undefined = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const db: Mongoose = await mongoose.connect(uri);

    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log("MongoDB connected");
    } else {
      console.log("MongoDB connection not stable");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    } else {
      console.error("Unknown error during MongoDB connection");
    }

    process.exit(1);
  }
}

export default dbConnect;