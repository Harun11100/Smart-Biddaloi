import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDb();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: "Authorization token missing" }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token format" }),
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // 3️⃣ Get schoolId from query
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, message: "schoolId is required" }),
        { status: 400 }
      );
    }

    // 4️⃣ Fetch school
    const school = await School.findById({slug:slug}).select("-password -__v");
    if (!school) {
      return new Response(
        JSON.stringify({ success: false, message: "school not found" }),
        { status: 404 }
      );
    }

    

    // ✅ Return school data
    return new Response(JSON.stringify({ success: true, school }), { status: 200 });

  } catch (error) {
    console.error("Get school error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500 }
    );
  }
}
