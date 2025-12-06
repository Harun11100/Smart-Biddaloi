import Routine from "@/app/model/Routine";
import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, imageUrl, publicId, schoolId } = body;

    if (!title || !imageUrl || !schoolId || !publicId) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDb();

    const routine = new Routine({
      title,
      imageUrl,
      publicId,
      schoolId,
    });

    await routine.save();

    const students = await Student.find({ schoolId, expoToken: { $exists: true, $ne: "" } });

    // Split students into small batches
    const chunkSize = 50;
    for (let i = 0; i < students.length; i += chunkSize) {
      const chunk = students.slice(i, i + chunkSize);

      const notificationPromises = chunk.map((student) =>
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title: "নতুন রুটিন প্রকাশিত হয়েছে ",
            body: `প্রিয় অভিভাবক, ${title} পরীক্ষার নতুন রুটিন প্রকাশ করা হয়েছে। অনুগ্রহ করে বিস্তারিত দেখতে অ্যাপে প্রবেশ করুন। আল্লাহ তায়ালা আপনাদের সন্তানদের সাফল্য দান করুন। 🤲`,
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        }).catch((err) => console.warn(`⚠️ Notification failed for ${student._id}:`, err))
      );

      await Promise.all(notificationPromises);

      // Small delay between batches to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Routine uploaded and notifications sent successfully",
        routine,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Routine upload error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
