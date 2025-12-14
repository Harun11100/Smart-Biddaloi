import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import StudentListClient from "./StudentListClient";

export default async function StudentListPage({ params }) {
  const { slug, schoolId, classId } = params;

  if (!slug || !schoolId) {
    return <div className="p-6 text-red-500">School ID is required</div>;
  }

  await connectDb();

  const students = await Student.find({ schoolId, classId })
    .select(
      "_id name roll className grade section gender dateOfBirth guardianName guardianPhone bloodGroup tuitionFee coachingFee paymentStatus totalMonthlyFees address classId remarks monthlyAbsent totalDueAmount totalPaidAmount"
    )
    .lean();

  // Convert MongoDB ObjectId to string
  const serializableStudents = students.map((std) => ({
    ...std,
    _id: std._id.toString(),
  }));

  return (
    <StudentListClient
      students={serializableStudents}
      schoolId={schoolId}
      classId={classId}
    />
  );
}
