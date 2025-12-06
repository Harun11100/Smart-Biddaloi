// app/api/products/[id]/route.js
import connectDb from "@/app/utils/db";
import Product from "@/app/model/Product";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    const { id } = params;

    // Find the product and delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
