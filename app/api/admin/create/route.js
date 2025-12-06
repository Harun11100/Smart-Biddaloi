// app/api/admin/register/route.js
import connectDb from "@/app/utils/db";
import Admin from "@/app/model/Admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const { name, email, password, phone,secretId } = await req.json();

    // Verify secretId
    if (secretId !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: "Invalid secret ID" },
        { status: 403 }
      );
    }
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // No need to hash manually, the model will handle it
    const admin = await Admin.create({
      name,
      email,
      password,
      phone,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
