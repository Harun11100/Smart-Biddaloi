// app/api/school/result/semester/admin/publish/route.js

import { NextResponse } from "next/server";

import connectDb from "@/app/utils/db";

import Class from "@/app/model/Class";
import SemesterResult from "@/app/model/SemesterResult";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      semesterId,
      classId,
    } = body;

    // =====================================================
    // Validate
    // =====================================================

    if (!schoolId || !semesterId || !classId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId, semesterId and classId are required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Find Class
    // =====================================================

    const classData = await Class.findOne({
      _id: classId,
      schoolId,
    }).lean();

    if (!classData) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found.",
        },
        { status: 404 }
      );
    }

    const expectedSubjects =
      Number(classData.totalSubject) || 0;

    const expectedStudents =
      Number(classData.studentCount) || 0;

    // =====================================================
    // Get All Student Semester Results
    // =====================================================

    const results = await SemesterResult.find({
      classId,
      semesterId,
      schoolId,
    }).lean();

    // =====================================================
    // Check Student Count
    // =====================================================

    if (results.length !== expectedStudents) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cannot publish. Not all students have semester results.",

          expectedStudents,

          studentsWithResults:
            results.length,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check Every Student Has All Subjects
    // =====================================================

    const incompleteStudents = [];

    for (const result of results) {
      const subjectCount =
        result.subjects?.length || 0;

      if (subjectCount !== expectedSubjects) {
        incompleteStudents.push({
          studentId: result.studentId,

          uploadedSubjects:
            subjectCount,

          expectedSubjects,
        });
      }
    }

    if (incompleteStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cannot publish. Some students do not have all subject results.",

          incompleteStudents,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check Subject Submission Status
    // =====================================================

    const unsubmittedStudents = [];

    for (const result of results) {
      const hasUnsubmittedSubject =
        result.subjects?.some(
          (subject) =>
            subject.status !== "submitted" &&
            subject.status !== "verified"
        );

      if (hasUnsubmittedSubject) {
        unsubmittedStudents.push(
          result.studentId
        );
      }
    }

    if (unsubmittedStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cannot publish. Some subject results are not submitted.",

          students:
            unsubmittedStudents,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check Already Published
    // =====================================================

    const alreadyPublished = results.every(
      (result) =>
        result.status === "published"
    );

    if (alreadyPublished) {
      return NextResponse.json(
        {
          success: false,

          message:
            "This class result has already been published.",
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Publish Result
    // =====================================================

    const publishedAt = new Date();

    const updateResult =
      await SemesterResult.updateMany(
        {
          classId,
          semesterId,
          schoolId,
        },
        {
          $set: {
            status: "published",
            publishedAt,
          },
        }
      );

    // =====================================================
    // 🔔 SEND PUSH NOTIFICATION
    //
    // Only students from THIS school + THIS class
    // will receive the notification.
    // =====================================================

    const students = await Student.find({
      schoolId,
      classId,
      expoToken: {
        $exists: true,
        $ne: "",
      },
    }).lean();

    let notificationsSent = 0;
    let notificationsFailed = 0;

    // =====================================================
    // Send Notifications in Batches
    // =====================================================

    const chunkSize = 50;

    for (
      let i = 0;
      i < students.length;
      i += chunkSize
    ) {
      const chunk = students.slice(
        i,
        i + chunkSize
      );

      const notificationPromises =
        chunk.map(async (student) => {
          try {
            const response = await fetch(
              "https://exp.host/--/api/v2/push/send",
              {
                method: "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  to: student.expoToken,

                  sound: "default",

                  title:
                    "সেমিস্টার পরীক্ষার ফলাফল প্রকাশিত হয়েছে 🎓",

                  body:
                    "আপনার সেমিস্টার পরীক্ষার ফলাফল এখন অ্যাপে দেখা যাচ্ছে। বিস্তারিত ফলাফল দেখতে অ্যাপটি খুলুন। 📱",

                  data: {
                    type: "SEMESTER_RESULT",

                    schoolId:
                      schoolId.toString(),

                    classId:
                      classId.toString(),

                    semesterId:
                      semesterId.toString(),

                    studentId:
                      student._id.toString(),

                    screen:
                      "SemesterResult",
                  },
                }),
              }
            );

            const responseData =
              await response.json();

            if (!response.ok) {
              throw new Error(
                responseData?.message ||
                  "Expo notification request failed"
              );
            }

            notificationsSent++;

            return {
              success: true,
              studentId:
                student._id.toString(),
            };
          } catch (error) {
            notificationsFailed++;

            console.warn(
              `⚠️ Notification failed for student ${student._id}:`,
              error.message
            );

            return {
              success: false,

              studentId:
                student._id.toString(),

              error: error.message,
            };
          }
        });

      await Promise.all(
        notificationPromises
      );

      // Small delay between batches
      if (
        i + chunkSize <
        students.length
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(resolve, 1000)
        );
      }
    }

    // =====================================================
    // Response
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Semester result published successfully.",

        data: {
          classId,

          semesterId,

          studentsPublished:
            updateResult.modifiedCount,

          studentsWithExpoToken:
            students.length,

          notificationsSent,

          notificationsFailed,

          publishedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ Publish semester result error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to publish semester result.",

        error: error.message,
      },
      { status: 500 }
    );
  }
}
