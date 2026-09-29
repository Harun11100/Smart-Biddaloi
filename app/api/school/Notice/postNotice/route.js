import Notice from "@/app/model/Notice";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import Expo from "expo-server-sdk";

export async function POST(req) {
  try {
    await connectDb();

    // ----------------------------------------------------
    // 1. Get request data
    // ----------------------------------------------------
    const { schoolId, title, description, date } = await req.json();

    // ----------------------------------------------------
    // 2. Validate input
    // ----------------------------------------------------
    if (!schoolId || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "School ID, title and description are required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 3. Check school
    // ----------------------------------------------------
    const school = await School.findById(schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------
    // 4. Restrict number of notices
    // ----------------------------------------------------
    const noticeCount = await Notice.countDocuments({
      schoolId,
    });

    if (noticeCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have reached the maximum of 5 notices. Please delete a previous notice before adding a new one.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 5. Create notice
    // ----------------------------------------------------
    const newNotice = await Notice.create({
      schoolId,
      title,
      description,
      date,
    });

    // ----------------------------------------------------
    // 6. Update school notice count
    // ----------------------------------------------------
    await School.findByIdAndUpdate(
      schoolId,
      {
        $inc: {
          totalNotice: 1,
        },
      },
      {
        new: true,
      }
    );

    // ----------------------------------------------------
    // 7. Find students with valid Expo tokens
    // ----------------------------------------------------
    const students = await Student.find({
      schoolId,
      expoToken: {
        $exists: true,
        $nin: [null, ""],
      },
    }).lean();

    // ----------------------------------------------------
    // Notification statistics
    // ----------------------------------------------------
    const notificationResult = {
      totalStudents: students.length,
      validTokens: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    // ----------------------------------------------------
    // 8. No students / tokens
    // ----------------------------------------------------
    if (students.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "Notice saved successfully. No students with push tokens were found.",
        notice: newNotice,
        notification: notificationResult,
      });
    }

    // ----------------------------------------------------
    // 9. Create Expo instance
    // ----------------------------------------------------
    const expo = new Expo();

    // ----------------------------------------------------
    // 10. Create notification messages
    // ----------------------------------------------------
    const messages = [];

    for (const student of students) {
      const token = student.expoToken;

      // No token
      if (!token) {
        notificationResult.skipped++;
        continue;
      }

      // Invalid Expo token
      if (!Expo.isExpoPushToken(token)) {
        console.error(
          `❌ Invalid Expo token for ${student.name}:`,
          token
        );

        notificationResult.skipped++;
        continue;
      }

      notificationResult.validTokens++;

      messages.push({
        to: token,

        sound: "default",

        title: "🏫 নতুন নোটিশ প্রকাশিত হয়েছে",

        body: `প্রিয় অভিভাবক, ${title} শিরোনামে একটি নতুন নোটিশ প্রকাশ করা হয়েছে। বিস্তারিত জানতে অনুগ্রহ করে অ্যাপটি খুলুন। 📱`,

        data: {
          type: "notice",
          noticeId: newNotice._id.toString(),
          studentId: student._id.toString(),
          guardianPhone: student.guardianPhone || "",
          title,
          date: date || "",
        },
      });
    }

    // ----------------------------------------------------
    // 11. Log notification information
    // ----------------------------------------------------
    console.log("========================================");
    console.log("📢 NOTICE PUSH NOTIFICATION");
    console.log("========================================");
    console.log("Notice ID:", newNotice._id.toString());
    console.log("Notice Title:", title);
    console.log("Total students:", students.length);
    console.log("Valid tokens:", notificationResult.validTokens);
    console.log("Messages:", messages.length);
    console.log("========================================");

    // ----------------------------------------------------
    // 12. Send notifications
    // ----------------------------------------------------
    if (messages.length > 0) {
      const chunks = expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          console.log(
            `📤 Sending notification chunk (${chunk.length})...`
          );

          const tickets =
            await expo.sendPushNotificationsAsync(chunk);

          console.log(
            "📨 Expo tickets:",
            JSON.stringify(tickets, null, 2)
          );

          tickets.forEach((ticket, index) => {
            const token = chunk[index]?.to;

            if (ticket.status === "ok") {
              notificationResult.sent++;

              console.log(
                `✅ Notice notification sent successfully to ${token}`
              );
            } else {
              notificationResult.failed++;

              console.error(
                "❌ Notice notification failed"
              );

              console.error("Token:", token);
              console.error(
                "Message:",
                ticket.message
              );
              console.error(
                "Details:",
                ticket.details
              );
            }
          });
        } catch (error) {
          notificationResult.failed += chunk.length;

          console.error(
            "❌ Error sending notice notifications:",
            error
          );
        }
      }
    } else {
      console.log(
        "⚠️ No valid Expo push tokens found."
      );
    }

    // ----------------------------------------------------
    // 13. Final response
    // ----------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        message:
          "Notice saved and notifications processed successfully.",

        notice: newNotice,

        notification: notificationResult,
      },
      { status: 201 }
    );
  } catch (err) {
    // ----------------------------------------------------
    // Global error
    // ----------------------------------------------------
    console.error(
      "❌ Error saving notice:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save notice.",
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}