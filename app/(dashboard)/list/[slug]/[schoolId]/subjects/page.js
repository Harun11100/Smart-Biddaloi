import SubjectListClient from "./SubjectListClient";
import Subject from "@/app/model/Subject";
import connectDb from "@/app/utils/db";

export default async function SubjectListPage({ params }) {
  const { schoolId } = params;

  await connectDb();

  const subjects = await Subject.find({ schoolId }).lean();

  return (
    <SubjectListClient
      subjects={JSON.parse(JSON.stringify(subjects))}
      schoolId={schoolId}
    />
  );
}
