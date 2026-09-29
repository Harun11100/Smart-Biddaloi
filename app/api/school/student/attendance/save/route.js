import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import Expo from "expo-server-sdk";

export async function POST(req) {
  try {
    await connectDb();

    // ----------------------------------------------------
    // 1. Get request data
    // ----------------------------------------------------
    const { schoolId, classId, date, attendance } = await req.json();

    // ----------------------------------------------------
    // 2. Validate request
    // ----------------------------------------------------
    if (
      !schoolId ||
      !classId ||
      !date ||
      !Array.isArray(attendance)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid required fields.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 3. Normalize date
    // ----------------------------------------------------
    const normalizedDate = String(date).replace(/\//g, "-");

    // ----------------------------------------------------
    // 4. Filter valid and unique attendance
    // ----------------------------------------------------
    const validAttendance = Array.from(
      new Map(
        attendance
          .filter(
            (item) =>
              item?.studentId &&
              ["present", "absent"].includes(item.status)
          )
          .map((item) => [String(item.studentId), item])
      ).values()
    );

    if (validAttendance.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid attendance entries found.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 5. Check whether attendance already exists
    // ----------------------------------------------------
    const existingAttendance = await Attendance.findOne({
      schoolId,
      classId,
      date: normalizedDate,
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          message: "Attendance already recorded for this class and date.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------------------
    // 6. Calculate attendance totals
    // ----------------------------------------------------
    const totalPresent = validAttendance.filter(
      (student) => student.status === "present"
    ).length;

    const totalAbsent = validAttendance.filter(
      (student) => student.status === "absent"
    ).length;

    // ----------------------------------------------------
    // 7. Save attendance
    // ----------------------------------------------------
    const savedAttendance = await Attendance.create({
      schoolId,
      classId,
      date: normalizedDate,
      attendance: validAttendance,
      totalPresent,
      totalAbsent,
    });

    // ----------------------------------------------------
    // 8. Get school
    // ----------------------------------------------------
    const school = await School.findById(schoolId);

    if (!school) {
      console.error("School not found:", schoolId);

      return NextResponse.json(
        {
          success: false,
          message: "Attendance saved, but school was not found.",
          savedAttendance,
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------
    // 9. Get all attendance for this school/date
    // ----------------------------------------------------
    const allAttendanceToday = await Attendance.find({
      schoolId,
      date: normalizedDate,
    });

    const schoolTotalStudents = allAttendanceToday.reduce(
      (sum, record) =>
        sum +
        Number(record.totalPresent || 0) +
        Number(record.totalAbsent || 0),
      0
    );

    const schoolTotalPresent = allAttendanceToday.reduce(
      (sum, record) =>
        sum + Number(record.totalPresent || 0),
      0
    );

    const schoolTotalAbsent = allAttendanceToday.reduce(
      (sum, record) =>
        sum + Number(record.totalAbsent || 0),
      0
    );

    // ----------------------------------------------------
    // 10. Update weekly attendance chart
    // ----------------------------------------------------
    let weeklyData = Array.isArray(
      school.weeklyAttendanceChartData
    )
      ? [...school.weeklyAttendanceChartData]
      : [];

    // Remove existing entry for the same date
    weeklyData = weeklyData.filter(
      (entry) => entry.date !== normalizedDate
    );

    // Keep maximum 7 entries
    if (weeklyData.length >= 7) {
      weeklyData.shift();
    }

    weeklyData.push({
      date: normalizedDate,
      totalStudents: schoolTotalStudents,
      totalPresent: schoolTotalPresent,
      totalAbsent: schoolTotalAbsent,
    });

    await School.findByIdAndUpdate(
      schoolId,
      {
        weeklyAttendanceChartData: weeklyData,
      },
      {
        new: true,
      }
    );

    // ----------------------------------------------------
    // 11. Get absent students
    // ----------------------------------------------------
    const absentIds = validAttendance
      .filter((student) => student.status === "absent")
      .map((student) => student.studentId);

    let notificationResult = {
      attempted: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    // ----------------------------------------------------
    // 12. Process absent students
    // ----------------------------------------------------
    if (absentIds.length > 0) {
      // -----------------------------------------------
      // Increment monthly absent count
      // -----------------------------------------------
      try {
        await Student.bulkWrite(
          absentIds.map((studentId) => ({
            updateOne: {
              filter: {
                _id: studentId,
              },
              update: {
                $inc: {
                  monthlyAbsent: 1,
                },
              },
            },
          }))
        );
      } catch (error) {
        console.error(
          "Error updating monthlyAbsent:",
          error
        );
      }

      // -----------------------------------------------
      // Find absent students with Expo tokens
      // -----------------------------------------------
      let absentStudents = [];

      try {
        absentStudents = await Student.find({
          _id: {
            $in: absentIds,
          },
          expoToken: {
            $exists: true,
            $nin: [null, ""],
          },
        }).lean();
      } catch (error) {
        console.error(
          "Error finding absent students:",
          error
        );
      }

      console.log(
        "========================================"
      );
      console.log("ABSENT STUDENTS");
      console.log(
        absentStudents.map((student) => ({
          id: String(student._id),
          name: student.name,
          expoToken: student.expoToken,
        }))
      );
      console.log(
        "========================================"
      );

      // -----------------------------------------------
      // Create Expo instance
      // -----------------------------------------------
      const expo = new Expo();

      const messages = [];

      // -----------------------------------------------
      // Create push messages
      // -----------------------------------------------
      for (const student of absentStudents) {
        const token = student.expoToken;

        // Check token
        if (!token) {
          notificationResult.skipped++;
          continue;
        }

        // Validate Expo token
        if (!Expo.isExpoPushToken(token)) {
          console.error(
            `❌ Invalid Expo push token for ${student.name}:`,
            token
          );

          notificationResult.skipped++;
          continue;
        }

        messages.push({
          to: token,

          sound: "default",

          title: "📚 উপস্থিতি সংক্রান্ত গুরুত্বপূর্ণ বার্তা",

           body: `প্রিয় অভিভাবক, আজ ${student.name} বিদ্যালয়ে উপস্থিত ছিল না। আপনার সন্তানের নিয়মিত উপস্থিতি তার পড়াশোনার জন্য অত্যন্ত গুরুত্বপূর্ণ। অনুগ্রহ করে বিষয়টি লক্ষ্য করুন।`,

          data: {
            type: "attendance",
            studentId: String(student._id),
            guardianPhone:
              student.guardianPhone || "",
            date: normalizedDate,
          },
        });
      }

      notificationResult.attempted = messages.length;

      console.log(
        `📱 Valid push messages: ${messages.length}`
      );

      // -----------------------------------------------
      // Send push notifications
      // -----------------------------------------------
      if (messages.length > 0) {
        const chunks = expo.chunkPushNotifications(
          messages
        );

        for (const chunk of chunks) {
          try {
            console.log(
              "📤 Sending push notification chunk..."
            );

            const tickets =
              await expo.sendPushNotificationsAsync(
                chunk
              );

            console.log(
              "📨 Expo push tickets:",
              JSON.stringify(tickets, null, 2)
            );

            tickets.forEach((ticket, index) => {
              const token = chunk[index]?.to;

              if (ticket.status === "ok") {
                notificationResult.sent++;

                console.log(
                  `✅ Notification sent successfully to ${token}`
                );
              } else {
                notificationResult.failed++;

                console.error(
                  "❌ Expo notification failed"
                );

                console.error(
                  "Token:",
                  token
                );

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
            notificationResult.failed +=
              chunk.length;

            console.error(
              "❌ Error sending Expo notifications:",
              error
            );
          }
        }
      } else {
        console.log(
          "⚠️ No valid Expo push tokens found."
        );
      }
    }

    // ----------------------------------------------------
    // 13. Final response
    // ----------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        message:
          "Attendance saved successfully.",

        savedAttendance,

        notification: {
          attempted:
            notificationResult.attempted,

          sent:
            notificationResult.sent,

          failed:
            notificationResult.failed,

          skipped:
            notificationResult.skipped,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // ----------------------------------------------------
    // Global error
    // ----------------------------------------------------
    console.error(
      "❌ Error saving attendance:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save attendance.",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}