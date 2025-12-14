import connectDb from "@/app/utils/db";
import Class from "@/app/model/Class";
import ClassListClient from "./ClassListClient";

interface PageProps {
  searchParams: {
    slug?: string;
  };
}

export default async function ClassListPage({ searchParams }: PageProps) {
  const slug = searchParams?.slug || "";

  if (!slug) {
    return <div className="p-6 text-red-500">School ID is required</div>;
  }

  await connectDb();

  const classes = await Class.find({ slug })
    .select("_id className sectionName studentCount guardianPhone slug")
    .lean();

  return <ClassListClient classes={classes} />;
}
