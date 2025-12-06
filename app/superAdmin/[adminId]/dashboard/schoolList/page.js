// app/admin/[id]/school/schoolList/page.jsx
import connectDb from "@/app/utils/db";
import SchoolCard from "./schoolCard"; // make sure the import path is correct
import School from "@/app/model/School";

export default async function SchoolsPage({ params }) {
  const { adminId: adminId } = params; // get adminId from dynamic route

  await connectDb();
  const schoolList = await School.find();

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
          স্কুল তালিকা
        </h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {schoolList.map((school) => (
            <SchoolCard key={school._id} school={school} adminId={adminId} />
          ))}
        </div>
      </div>
    </section>
  );
}
