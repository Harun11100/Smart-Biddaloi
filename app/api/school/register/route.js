import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import nodemailer from "nodemailer";

// backend/utils/validClientIds.js
 const validClientIds = new Set([
  "SCH001","SCH002","SCH003","SCH004","SCH005","SCH006","SCH007","SCH008",
  "SCH009","SCH010","SCH011","SCH012","SCH013","SCH014","SCH015","SCH016",
  "SCH017","SCH018"
]);

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    const {
      schoolName,
      principalName,
      email,
      phone,
      clientId,
      contactNumber,
      wordNo,
      union,
      district,
      secretName,
      password,
      logo,
      cover,
      terms,
    } = body;

    // Validate required fields
    if (!schoolName || !principalName || !email || !phone || !union || !district ||
        !secretName || !password || !wordNo || !clientId) {
      return new Response(
        JSON.stringify({ success: false, message: "সব ফিল্ড পূরণ করুন" }),
        { status: 400 }
      );
    }

    // Validate client ID
    if (!validClientIds.has(clientId)) {
      return new Response(
        JSON.stringify({ success: false, message: "অবৈধ Client ID" }),
        { status: 400 }
      );
    }

    // Prevent reuse of the same client ID
    const clientUsed = await School.findOne({ clientId });
    if (clientUsed) {
      return new Response(
        JSON.stringify({ success: false, message: "Client ID ইতিমধ্যেই ব্যবহার হয়েছে" }),
        { status: 400 }
      );
    }

    // Check if phone or email already exists
    const existing = await School.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "ফোন বা ইমেইল ইতিমধ্যেই ব্যবহার হচ্ছে",
        }),
        { status: 400 }
      );
    }

    // Create new principal
    const school = await School.create({
      schoolName,
      principalName,
      email,
      phone,
      contactNumber,
      wordNo,
      clientId,
      union,
      district,
      secretName,
      password,
      logo,
      cover,
      terms,
    });

    // Clean response
    const safeSchool = {
      schoolId: school._id,
      schoolName: school.schoolName,
      principalName: school.principalName,
      email: school.email,
      phone: school.phone,
      totalStudents: school.totalStudents,
      totalTeachers: school.totalTeachers,
      totalNotice: school.totalNotice,
      totalPayment: school.totalPayments,
    };

    // Send registration success email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Smart School Manager" <${process.env.GMAIL_USER}>`,
      to: school.email,
      subject: "নিবন্ধন সফল হয়েছে",
      text: `আপনি সফলভাবে নিবন্ধিত হয়েছেন। আপনার স্কুলের নাম: ${school.schoolName}`,
      html: `<p>আপনি সফলভাবে নিবন্ধিত হয়েছেন।</p>
             <p>স্কুলের নাম: <b>${school.schoolName}</b></p>
             <p>আপনি এখন লগইন করতে পারেন।</p>`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "স্কুল সফলভাবে নিবন্ধিত হয়েছেন",
        school: safeSchool,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Principal registration error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "কিছু ভুল হয়েছে" }),
      { status: 500 }
    );
  }
}
