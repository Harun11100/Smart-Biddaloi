// src/app/api/promo/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Product from "@/app/model/Product";
import Admin from "@/app/model/Admin";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "adminId is required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

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
