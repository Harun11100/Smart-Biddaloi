import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import AppUrlUpdater from "./updateAppUrl";
import CreateAlert from "./updateAlert";
import EmailEditor from "@/app/components/EmailEditor";

export const dynamic = "force-dynamic";

export default async function SchoolDetailsPage({ params }) {
  await connectDb();
  const school = await School.findById(params.schoolId).lean();

  if (!school) return notFound();

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      {/* Header Cover */}
      <div className="relative h-64 w-full">
        {school.cover?.url ? (
          <Image
            src={school.cover.url}
            alt={`${school.schoolName} Cover`}
            fill
            className="object-cover brightness-75"
          />
        ) : (
          <div className="bg-blue-200 w-full h-full flex items-center justify-center text-blue-700">
            No Cover Image
          </div>
        )}

        <div className="absolute bottom-4 left-6 bg-white/80 p-3 rounded-lg shadow">
          {school.logo?.url && (
            <Image
              src={school.logo.url}
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          {school.schoolName}
        </h1>

        <p className="text-gray-600 mb-6">
          প্রধান শিক্ষক:{" "}
          <span className="font-semibold">{school.principalName}</span>
        </p>

        {/* Email + Details */}
        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              যোগাযোগ তথ্য
            </h2>

            <EmailEditor
              schoolId={school._id.toString()}
              email={school.email || ""}
            />

            <p>📞 Email: {school.email}</p>
            <p>📞 ফোন: {school.phone}</p>
            <p>📱 যোগাযোগ নম্বর: {school.contactNumber}</p>
            <p>🌍 ওয়েবসাইট: {school.website || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">ঠিকানা</h2>
            <p>জেলা: {school.district}</p>
            <p>ইউনিয়ন: {school.union}</p>
            <p>ওয়ার্ড: {school.wordNo}</p>
            <p>Client ID: {school.clientId}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard label="শিক্ষার্থী" value={school.totalStudents} />
          <StatCard label="শিক্ষক" value={school.totalTeachers} />
          <StatCard label="নোটিশ" value={school.totalNotice} />
          <StatCard label="পেমেন্ট" value={school.totalPayment} />
        </div>

        {/* App Update */}
        <div className="text-center mt-10">
          {school.appUpdateUrl && (
            <a
              href={school.appUpdateUrl}
              target="_blank"
              className="inline-block bg-yellow-400 text-blue-950 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              📲 সর্বশেষ অ্যাপ ডাউনলোড করুন
            </a>
          )}

          <div className="mt-8">
            <AppUrlUpdater
              schoolId={school._id.toString()}
              existingUrl={school.appUpdateUrl || ""}
              versionCode={school.versionCode || ""}
            />
          </div>

          <div className="mt-8">
            <CreateAlert
              schoolId={school._id.toString()}
              alertTitle={school.alertTitle || ""}
              alertMessage={school.alertMessage || ""}
              availableAlert={school.availableAlert}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-xl font-bold text-blue-800">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}
