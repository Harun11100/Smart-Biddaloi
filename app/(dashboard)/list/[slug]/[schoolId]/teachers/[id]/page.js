import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import mongoose from "mongoose";
import TeacherClient from "./TeacherCLient";

export default async function SingleTeacherPage({ params }) {
  const { id } = params;

  // 🔒 Guard invalid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <div className="p-4 text-red-500">Invalid Teacher ID</div>;
  }

  await connectDb();

  const teacher = await Teacher.findById(id)
    .select("-password -loginOTP -loginOTPExpiry")
    .populate("schoolId", "name")
    .lean();

  if (!teacher) {
    return <div className="p-4 text-red-500">Teacher not found</div>;
  }

  // 👇 Ensure serializable data for Client Component
  return (
    <TeacherClient teacher={JSON.parse(JSON.stringify(teacher))} />
  );
}
