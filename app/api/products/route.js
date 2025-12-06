import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Product from "@/app/model/Product";
import Admin from "@/app/model/Admin";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    const { name, price, discount, link, image, title,adminId } = body;



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
    

    // Validation
    if (!name || !price || !discount || !link || !image || !title) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      price,
      discount,
      link,
      image,
      title, // Most Trending, Popular, etc.
    });

    await product.save();

    return NextResponse.json(
      { message: "Product uploaded successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
