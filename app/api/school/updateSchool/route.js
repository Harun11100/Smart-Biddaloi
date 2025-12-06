import School from "@/app/model/School";
import connectDb from "@/app/utils/db";

export async function PUT(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { schoolId, schoolName,email,contactNumber,phone,principalName, logo, cover } = body;

    if (!schoolId) {
      return new Response(JSON.stringify({ message: "school ID is required" }), {
        status: 400,
      });
    }
    const school = await School.findById(schoolId);
    if (!school) {
      return new Response(JSON.stringify({ message: "school not found" }), { status: 404 });
    }

    // Update allowed fields
    school.principalName = principalName ?? school.principalName;
    school.schoolName = schoolName ?? school.schoolName;
    school.contactNumber = contactNumber ?? school.contactNumber;
    school.email= email ?? school.email;
    school.phone = phone ?? school.phone;

    if (logo && logo.url && logo.public_id) school.logo = logo;
    if (cover && cover.url && cover.public_id) school.cover = cover;

    const updatedSchool = await school.save();

    return new Response(
      JSON.stringify({ message: "school updated successfully", school: updatedSchool }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Updateschool Error:", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong", error: error.message }),
      { status: 500 }
    );
  }
}
