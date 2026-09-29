import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import Expo from "expo-server-sdk";

export async function PUT(req) {
  try {
    await connectDb();

    // ----------------------------------------------------
    // 1. Get request data
    // ----------------------------------------------------
    const {
      schoolId,
      classId,
      date,
      attendance,
    } = await req.json();

    // ----------------------------------------------------
    // 2. Validate input
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
          message: "Missing or invalid input fields.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 3. Normalize date
    // ----------------------------------------------------
    const normalizedDate = String(date).replace(/\//g, "-");

    // ----------------------------------------------------
    // 4. Find existing attendance
    // ----------------------------------------------------
    const existing = await Attendance.findOne({
      schoolId,
      classId,
      date: normalizedDate,
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance record not found for today.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------
    // 5. Find students whose status changed:
    //
    // ABSENT → PRESENT
    // ----------------------------------------------------
    const returnedStudents = [];

    for (const oldStudent of existing.attendance) {
      const updatedStudent = attendance.find(
        (student) =>
          String(student.studentId) ===
          String(oldStudent.studentId)
      );

      if (!updatedStudent) {
        continue;
      }

      const previousStatus = oldStudent.status;
      const newStatus = updatedStudent.status;

      if (
        previousStatus === "absent" &&
        newStatus === "present"
      ) {
        returnedStudents.push({
          studentId: oldStudent.studentId,
          name: oldStudent.name,
        });
      }
    }

    console.log(
      "========================================"
    );
    console.log("ABSENT → PRESENT STUDENTS");
    console.log(
      returnedStudents
    );
    console.log(
      "========================================"
    );

    // ----------------------------------------------------
    // 6. Update attendance list
    // ----------------------------------------------------
    const updatedList = existing.attendance.map(
      (student) => {
        const updated = attendance.find(
          (item) =>
            String(item.studentId) ===
            String(student.studentId)
        );

        if (updated) {
          return {
            ...student.toObject(),
            status: updated.status,
          };
        }

        return student;
      }
    );

    // ----------------------------------------------------
    // 7. Recalculate class totals
    // ----------------------------------------------------
    const totalPresent = updatedList.filter(
      (student) =>
        student.status === "present"
    ).length;

    const totalAbsent = updatedList.filter(
      (student) =>
        student.status === "absent"
    ).length;

    existing.attendance = updatedList;
    existing.totalPresent = totalPresent;
    existing.totalAbsent = totalAbsent;

    // ----------------------------------------------------
    // 8. Save attendance
    // ----------------------------------------------------
    await existing.save();

    // ----------------------------------------------------
    // 9. Send notification to students whose status
    //    changed from ABSENT → PRESENT
    // ----------------------------------------------------
    const notificationResult = {
      attempted: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    if (returnedStudents.length > 0) {
      try {
        // -----------------------------------------------
        // Find students and their Expo tokens
        // -----------------------------------------------
        const studentIds =
          returnedStudents.map(
            (student) => student.studentId
          );

        const students =
          await Student.find({
            _id: {
              $in: studentIds,
            },
            expoToken: {
              $exists: true,
              $nin: [null, ""],
            },
          }).lean();

        const expo = new Expo();

        const messages = [];

        // -----------------------------------------------
        // Create notifications
        // -----------------------------------------------
        for (const student of students) {
          const token = student.expoToken;

          if (!token) {
            notificationResult.skipped++;
            continue;
          }

          if (!Expo.isExpoPushToken(token)) {
            console.error(
              `❌ Invalid Expo token for ${student.name}:`,
              token
            );

            notificationResult.skipped++;
            continue;
          }

          messages.push({
            to: token,

            sound: "default",

            title:
              "✅ উপস্থিতির তথ্য আপডেট হয়েছে",

            body:
              `প্রিয় অভিভাবক, ${student.name}-এর আজকের উপস্থিতির তথ্য আপডেট করা হয়েছে। তিনি এখন উপস্থিত হিসেবে রেকর্ড হয়েছেন। 📚`,

            data: {
              type: "attendance_update",

              studentId:
                String(student._id),

              guardianPhone:
                student.guardianPhone || "",

              date: normalizedDate,

              previousStatus: "absent",

              currentStatus: "present",
            },
          });
        }

        notificationResult.attempted =
          messages.length;

        console.log(
          `📱 Attendance update notifications: ${messages.length}`
        );

        // -----------------------------------------------
        // Send notifications
        // -----------------------------------------------
        if (messages.length > 0) {
          const chunks =
            expo.chunkPushNotifications(
              messages
            );

          for (const chunk of chunks) {
            try {
              console.log(
                "📤 Sending attendance update notifications..."
              );

              const tickets =
                await expo.sendPushNotificationsAsync(
                  chunk
                );

              console.log(
                "📨 Expo tickets:",
                JSON.stringify(
                  tickets,
                  null,
                  2
                )
              );

              tickets.forEach(
                (ticket, index) => {
                  const token =
                    chunk[index]?.to;

                  if (
                    ticket.status === "ok"
                  ) {
                    notificationResult.sent++;

                    console.log(
                      `✅ Attendance update notification sent to ${token}`
                    );
                  } else {
                    notificationResult.failed++;

                    console.error(
                      "❌ Attendance update notification failed"
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
                }
              );
            } catch (error) {
              notificationResult.failed +=
                chunk.length;

              console.error(
                "❌ Error sending attendance update notification:",
                error
              );
            }
          }
        } else {
          console.log(
            "⚠️ No valid Expo tokens found for updated students."
          );
        }
      } catch (error) {
        console.error(
          "❌ Error processing attendance notifications:",
          error
        );
      }
    }

    // ----------------------------------------------------
    // 10. Update school-level weekly chart
    // ----------------------------------------------------
    const school =
      await School.findById(schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance updated, but school was not found.",
          attendance: existing,
          notification:
            notificationResult,
        },
        { status: 404 }
      );
    }

    let weeklyData =
      Array.isArray(
        school.weeklyAttendanceChartData
      )
        ? [...school.weeklyAttendanceChartData]
        : [];

    // ----------------------------------------------------
    // 11. Get all attendance for this school/date
    // ----------------------------------------------------
    const allAttendanceToday =
      await Attendance.find({
        schoolId,
        date: normalizedDate,
      });

    const schoolTotalStudents =
      allAttendanceToday.reduce(
        (sum, record) =>
          sum +
          Number(record.totalPresent || 0) +
          Number(record.totalAbsent || 0),
        0
      );

    const schoolTotalPresent =
      allAttendanceToday.reduce(
        (sum, record) =>
          sum +
          Number(record.totalPresent || 0),
        0
      );

    const schoolTotalAbsent =
      allAttendanceToday.reduce(
        (sum, record) =>
          sum +
          Number(record.totalAbsent || 0),
        0
      );

    // ----------------------------------------------------
    // 12. Remove existing date from weekly chart
    // ----------------------------------------------------
    weeklyData = weeklyData.filter(
      (entry) =>
        entry.date !== normalizedDate
    );

    // ----------------------------------------------------
    // 13. Keep maximum 7 entries
    // ----------------------------------------------------
    if (weeklyData.length >= 7) {
      weeklyData.shift();
    }

    // ----------------------------------------------------
    // 14. Add updated school summary
    // ----------------------------------------------------
    weeklyData.push({
      date: normalizedDate,
      totalStudents:
        schoolTotalStudents,
      totalPresent:
        schoolTotalPresent,
      totalAbsent:
        schoolTotalAbsent,
    });

    // ----------------------------------------------------
    // 15. Save weekly chart
    // ----------------------------------------------------
    await School.findByIdAndUpdate(
      schoolId,
      {
        weeklyAttendanceChartData:
          weeklyData,
      },
      {
        new: true,
      }
    );

    // ----------------------------------------------------
    // 16. Final response
    // ----------------------------------------------------
    return NextResponse.json({
      success: true,

      message:
        "Attendance updated successfully and weekly chart refreshed.",

      attendance: existing,

      returnedStudents,

      notification:
        notificationResult,
    });
  } catch (error) {
    console.error(
      "❌ Error updating attendance:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update attendance.",
        error:
          error?.message ||
          "Unknown error",
      },
      { status: 500 }
    );
  }
}