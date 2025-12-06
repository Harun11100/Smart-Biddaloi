import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "@/app/utils/db";
import Admin from "@/app/model/Admin";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import Teacher from "@/app/model/Teacher";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");
    
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }


    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid token or admin mismatch" },
        { status: 401 }
      );
    }

    // Fetch stats
    const totalSchools = await School.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    // Create stats object
    const stats = {
      totalSchools,
      totalStudents,
      totalTeachers,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
