// src/app/api/promo/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Product from "@/app/model/Product";


export async function GET() {
  try {
    await connectDb();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
