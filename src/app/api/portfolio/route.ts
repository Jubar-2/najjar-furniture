import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import PortfolioItem from "@/models/portfolioItem.model";

// GET /api/portfolio
// Lists all portfolio items for the public portfolio page, most recent first.
export async function GET() {
  try {
    await dbConnect();

    const items = await PortfolioItem.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error("GET /api/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}