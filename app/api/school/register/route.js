import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolName,
      principalName,
      email,
      phone,
      password,
      logo,
      cover,
      terms,
    } = body;

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------

    if (
      !schoolName ||
      !principalName ||
      !email ||
      !phone ||
      !password
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "সব প্রয়োজনীয় ফিল্ড পূরণ করুন",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------------------
    // Terms validation
    // -----------------------------------------

    if (terms !== true) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Terms & Conditions গ্রহণ করতে হবে",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------------------
    // Clean data
    // -----------------------------------------

    const cleanSchoolName = schoolName.trim();
    const cleanPrincipalName = principalName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // -----------------------------------------
    // Check existing school
    // -----------------------------------------

    const existingSchool = await School.findOne({
      $or: [
        { email: cleanEmail },
        { phone: cleanPhone },
      ],
    });

    if (existingSchool) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "এই ফোন নম্বর বা ইমেইল ইতিমধ্যেই ব্যবহার হচ্ছে",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------------------
    // Generate unique slug
    // -----------------------------------------

    function generateSlug(text) {
      return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
    }

    const baseSlug = generateSlug(cleanSchoolName);

    let slug = baseSlug;
    let count = 1;

    while (await School.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // -----------------------------------------
    // Create school
    // -----------------------------------------

    const school = await School.create({
      schoolName: cleanSchoolName,
      principalName: cleanPrincipalName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      logo: logo || "",
      cover: cover || "",
      terms: terms === true,
      slug,
    });

    // -----------------------------------------
    // Safe response
    // -----------------------------------------

    const safeSchool = {
      schoolId: school._id,
      schoolName: school.schoolName,
      principalName: school.principalName,
      email: school.email,
      phone: school.phone,
      totalStudents: school.totalStudents || 0,
      totalTeachers: school.totalTeachers || 0,
      totalNotice: school.totalNotice || 0,
      totalPayment: school.totalPayments || 0,
      logo: school.logo || "",
      cover: school.cover || "",
      slug: school.slug,
    };

    // -----------------------------------------
    // Send registration email
    // -----------------------------------------

    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
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
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>নিবন্ধন সফল হয়েছে</h2>

              <p>আপনার স্কুল সফলভাবে নিবন্ধিত হয়েছে।</p>

              <p>
                <strong>স্কুলের নাম:</strong>
                ${school.schoolName}
              </p>

              <p>
                <strong>প্রধান শিক্ষকের নাম:</strong>
                ${school.principalName}
              </p>

              <p>
                <strong>ইমেইল:</strong>
                ${school.email}
              </p>

              <p>
                <strong>মোবাইল:</strong>
                ${school.phone}
              </p>

              <p>
                আপনি এখন Smart School Manager-এ লগইন করতে পারেন।
              </p>

              <p>
                ধন্যবাদ।
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      // Email failure should not cancel successful registration
      console.error("Registration email error:", emailError);
    }

    // -----------------------------------------
    // Success response
    // -----------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        message: "স্কুল সফলভাবে নিবন্ধিত হয়েছে",
        school: safeSchool,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Principal registration error:", error);

    // -----------------------------------------
    // Duplicate key error
    // -----------------------------------------

    if (error?.code === 11000) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "এই স্কুলের তথ্য ইতিমধ্যেই ব্যবহার করা হয়েছে",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------------------
    // Server error
    // -----------------------------------------

    return new Response(
      JSON.stringify({
        success: false,
        message: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}