import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import connectDb from "@/app/utils/db";
import SchoolAlbum from "@/app/model/SchoolAlbum";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function DELETE(req) {
  try {
    await connectDb();

    const { albumId } = await req.json();
    if (!albumId) {
      return NextResponse.json(
        { success: false, message: "albumId is required." },
        { status: 400 }
      );
    }

    // Find the album document
    const album = await SchoolAlbum.findById(albumId);
    if (!album) {
      return NextResponse.json(
        { success: false, message: "Album not found." },
        { status: 404 }
      );
    }

    // Delete photo from Cloudinary if it exists
    if (album.photo?.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(album.photo.public_id);
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr);
      }
    }

    // Delete the album document from MongoDB
    await album.deleteOne();

    return NextResponse.json(
      { success: true, message: "Photo deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete album error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete photo.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
