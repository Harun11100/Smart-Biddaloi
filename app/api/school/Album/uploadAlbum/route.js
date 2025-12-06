import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import SchoolAlbum from "@/app/model/SchoolAlbum";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, eventName, caption, uploadedAt, photo } = await req.json();

    // Validate input
    if (!schoolId || !eventName || !caption || !uploadedAt || !photo?.url) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    // ✅ Create a new album entry every time
    const album = new SchoolAlbum({
      schoolId,
      eventName,
      caption,
      uploadedAt: new Date(uploadedAt),
      photo: {
        url: photo.url,
        public_id: photo.public_id || "",
      },
    });

    await album.save();

    return NextResponse.json({
      success: true,
      message: "New album created successfully",
      album,
    });
  } catch (error) {
    console.error("UploadAlbum API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
