import connectDb from "@/app/utils/db";
import Class from "@/app/model/Class";
import ClassListClient from "./ClassListClient";

export default async function ClassListPage({ params }) {
  const { slug, schoolId } = await params;

  if (!slug || !schoolId) {
    return <div className="p-6 text-red-500">School ID is required</div>;
  }

  await connectDb();

  const classes = await Class.find({ schoolId })
    .select("_id className sectionName studentCount schoolId")
    .lean();

  const serializableClasses = classes.map((cls) => ({
    _id: cls._id.toString(),
    className: cls.className,
    sectionName: cls.sectionName || "",
    studentCount: cls.studentCount ?? 0,
    schoolId: cls.schoolId,
  }));

  return <ClassListClient classes={serializableClasses} schoolId={schoolId} slug={slug} />;
}
