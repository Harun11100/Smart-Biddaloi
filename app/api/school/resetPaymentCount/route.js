import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import bcrypt from "bcryptjs"; // Optional: Use bcrypt if your passwords are hashed

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, password } = await req.json();

    // 1. Validate incoming data
    if (!schoolId || !password) {
      return NextResponse.json(
        { success: false, message: "স্কুল আইডি এবং পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    // 2. Find the school by ID (include password if hidden by default in Mongoose schema)
    const school = await School.findById(schoolId).select("+password");

    if (!school) {
      return NextResponse.json(
        { success: false, message: "স্কুল অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // 3. Verify Password
    // Note: If you store plain text passwords, use: const isPasswordValid = school.password === password;
    const isPasswordValid = await bcrypt.compare(password, school.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।" },
        { status: 401 }
      );
    }

    // 4. Reset the payment count
    school.totalPaymentCount = 0;
    await school.save();

    return NextResponse.json({
      success: true,
      message: "মাসিক পেমেন্ট গণনা সফলভাবে রিসেট করা হয়েছে।",
    });
  } catch (error) {
    console.error("Error in resetPaymentCount:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}