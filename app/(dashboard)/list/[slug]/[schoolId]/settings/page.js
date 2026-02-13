import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import SchoolSettingsClientsPage from "./SettingsCilent";

export default async function SettingsPage({ params }) {
  const { slug, schoolId } = params;

  // Validation: slug & schoolId
  if (!slug || !schoolId) {
    return (
      <div className="p-6 text-red-500 text-lg font-semibold">
        School ID is required
      </div>
    );
  }

  // Connect to MongoDB
  await connectDb();

  // Fetch school data
  const schoolData = await School.findById(schoolId);

  // Render the client-side settings page
  return (
    <SchoolSettingsClientsPage
      schoolId={schoolId}
      slug={slug}
      schoolData={JSON.parse(JSON.stringify(schoolData))}
    />
  );
}
