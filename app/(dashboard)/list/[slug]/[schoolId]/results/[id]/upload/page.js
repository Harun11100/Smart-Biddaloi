
import connectDb from "@/lib/db";
import Subject from "@/model/Subject";
import mongoose from "mongoose";
import ResultForm from "./ResultUploadClient";

export default async function ResultUploadPage({ params }) {
  const { schoolId, classId, id: studentId } = params;
 await connectDb();

  const subjects = await Subject.find({
    classId: new mongoose.Types.ObjectId(classId),
  }).lean();


  console.log("Fetched subjects for ResultUploadPage:", { schoolId, classId, studentId, subjects })

  return (
    <ResultForm
      schoolId={schoolId}
      classId={classId}
      studentId={studentId}
      subjects={subjects}
    />
  );
}
