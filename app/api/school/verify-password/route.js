// app/api/school/verify-password/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import bcrypt from "bcryptjs";
import School from "@/app/model/School";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, password } = await req.json();

    if (!schoolId || !password) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, error: "School not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Password verification error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
