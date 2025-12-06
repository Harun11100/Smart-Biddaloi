import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import SchoolAlbum from "@/app/model/SchoolAlbum";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = 30;
    const skip = (page - 1) * limit;

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "schoolId query parameter is required" },
        { status: 400 }
      );
    }

    const totalAlbums = await SchoolAlbum.countDocuments({ schoolId });

    const albums = await SchoolAlbum.find({ schoolId })
      .sort({ uploadedAt: -1 }) // newest first
      .skip(skip)
      .limit(limit)
      .select("photo caption eventName uploadedAt");

    // Transform albums for frontend consumption
    const photos = albums.map((album) => ({
      _id:album._id,
      url: album.photo?.url || "",
      public_id: album.photo?.public_id || "",
      caption: album.caption,
      eventName: album.eventName,
      uploadedAt: album.uploadedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        photos,
        totalPhotos: totalAlbums,
        currentPage: page,
        totalPages: Math.ceil(totalAlbums / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GetAlbum API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
