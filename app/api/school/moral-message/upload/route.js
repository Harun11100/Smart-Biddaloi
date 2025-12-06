import connectDb from "@/app/utils/db";
import MoralMessage from "@/app/model/MoralMessage";
import { NextResponse } from "next/server";
import Student from "@/app/model/Student";

// ✅ Create new moral message (Teacher)
export async function POST(req) {
  try {
    await connectDb();

    const { teacherId, schoolId, classId, title, message } = await req.json();

    // ✅ Validate input
    if (!teacherId || !schoolId || !classId || !title || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Create the moral message
    const newMessage = await MoralMessage.create({
      teacherId,
      schoolId,
      classId,
      title,
      message,
    });

    // ✅ Find students in the class with expo tokens
    const students = await Student.find({
      classId,
      schoolId,
      expoToken: { $exists: true, $ne: "" },
    });

    // ✅ Send notification to each student
    for (const student of students) {
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title: title,
            body: message,
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        });
      } catch (pushErr) {
        console.warn(`⚠️ Push notification failed for student ${student._id}:`, pushErr);
      }
    }

    return NextResponse.json(
      { success: true, data: newMessage, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Moral message POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
