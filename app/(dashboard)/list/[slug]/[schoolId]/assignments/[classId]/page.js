// app/homework/page.jsx
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";
import HomeworkClient from "./HomeworkClient";

export default async function HomeworkPage({ params }) {
  const { schoolId, classId } = params;

  if (!schoolId || !classId) {
    return <p className="text-center mt-10">Missing parameters</p>;
  }

  await connectDb();

  const homework = await Homework.find({ schoolId, classId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <HomeworkClient
      initialHomework={JSON.parse(JSON.stringify(homework))}
      schoolId={schoolId}
      classId={classId}
    />
  );
}
