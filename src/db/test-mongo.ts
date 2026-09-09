import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri, {
  family: 4,
  serverSelectionTimeoutMS: 15000,
});

async function test() {
  try {
    console.log("Connecting with MongoClient...");

    await client.connect();

    await client.db().command({ ping: 1 });

    console.log("MongoDB PING SUCCESS");
  } catch (error) {
    console.error("MongoDB PING FAILED:", error);
  } finally {
    await client.close();
  }
}

test();