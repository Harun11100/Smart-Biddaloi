import connectDb from "@/app/utils/db";
import Class from "@/app/model/Class";
import ClassListClient from "./ClassListClient";

interface PageProps {
  params: {
    slug: string;
    schoolId: string;
  };
}

export default async function ClassListPage({ params }: PageProps) {
  const { slug, schoolId } = params;

  if (!slug || !schoolId) {
    return <div className="p-6 text-red-500">School ID is required</div>;
  }

  await connectDb();

  const classes = await Class.find({ schoolId })
    .select("_id className sectionName studentCount")
    .lean();

  // Convert MongoDB ObjectId to string
  const serializableClasses = classes.map((cls) => ({
    ...cls,
    _id: cls._id.toString(),
  }));
  
  return <ClassListClient classes={serializableClasses} schoolId={schoolId} slug={slug} />;
}
