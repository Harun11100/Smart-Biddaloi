import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import StudentClient from "./StudentDetails";
import mongoose from "mongoose";

export default async function SingleStudentPage({ params }) {
  const {id} = params;

  // Connect to DB
  await connectDb();

  // Fetch student from MongoDB

  console.log(id)
  const student = await Student.findById(id).lean();

  if (!student) {
    return <div className="p-4 text-red-500">Student not found</div>;
  }

  // Pass the student data to client component
  return <StudentClient student={JSON.parse(JSON.stringify(student))} />;
}
