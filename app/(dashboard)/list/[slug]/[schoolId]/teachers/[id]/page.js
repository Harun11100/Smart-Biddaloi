import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import TeacherClients from "./TeacherCLient.js";

export default async function SingleTeacherPage({ params }) {
  const { id } = params;

  await connectDb();

  const teacher = await Teacher.findById(id)
    .select("-password -loginOTP -loginOTPExpiry")
    .populate("schoolId", "name")
    .lean();

  if (!teacher) {
    return <div className="p-4 text-red-500">Teacher not found</div>;
  }
  
  return <TeacherClients teacher={JSON.parse(JSON.stringify(teacher))} />;
}
