// app/api/products/[id]/route.js
import connectDb from "@/app/utils/db";
import Product from "@/app/model/Product";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { id } = params;
    const data = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name: data.name, price: data.price, discount: data.discount },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
