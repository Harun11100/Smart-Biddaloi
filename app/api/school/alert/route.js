import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function PATCH(req) {
  try {
    await connectDb();
    const body = await req.json();

    const { schoolId, availableAlert, alertTitle, alertMessage } = body;
      console.log( schoolId ,alertTitle ,alertMessage,availableAlert)
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "schoolId missing" });
    }

    const updated = await School.findByIdAndUpdate(
      schoolId,
      {
        availableAlert,
        alertTitle,
        alertMessage,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Alert updated successfully",
      data: updated,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
