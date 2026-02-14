import Class from "@/app/model/Class";
import SubjectListClient from "./SubjectListClient";
import Subject from "@/app/model/Subject";
import connectDb from "@/app/utils/db";

export default async function SubjectListPage({ params }) {
  const { schoolId,classId } = params;

  
  await connectDb();

  const subjects = await Subject.find({ schoolId, classId }).lean();
  const classData = await Class.findById(classId).lean(); 
  console.log(classData)
  return (
    <SubjectListClient
      subjects={JSON.parse(JSON.stringify(subjects))}
      schoolId={schoolId}
      classId={classId}
      className={classData.className}
    />
  );
}
