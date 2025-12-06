import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { studentId, title, body: notificationBody } = await req.json();

    // Validate input
    if (!studentId || !title || !notificationBody) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find student with valid Expo token
    const student = await Student.findOne({
      _id: studentId,
      expoToken: { $exists: true, $ne: null },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid student found or missing Expo token",
        },
        { status: 404 }
      );
    }

    // Prepare Expo push notification message
    const message = {
      to: student.expoToken,
      sound: "default",
      title,
      body: notificationBody,
      data: {
        studentId: student._id.toString(),
        guardianPhone: student.guardianPhone || null,
      },
    };

    // Send push notification
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const expoResponse = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent successfully",
        expoResponse,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Notification error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to send notification",
      },
      { status: 500 }
    );
  }
}
