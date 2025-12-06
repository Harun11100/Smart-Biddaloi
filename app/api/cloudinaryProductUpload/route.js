import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");
    const folder = formData.get("path") || "uploads";

    if (!files || files.length === 0) {
      return NextResponse.json({ urls: [] });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );

        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return NextResponse.json(
      { message: "Upload failed", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { public_ids } = body; // expects an array of Cloudinary public_ids

    if (!public_ids || public_ids.length === 0) {
      return NextResponse.json(
        { message: "No public_ids provided" },
        { status: 400 }
      );
    }

    // Delete images from Cloudinary
    const deleteResults = await Promise.all(
      public_ids.map((id) => cloudinary.uploader.destroy(id))
    );

    return NextResponse.json(
      { message: "Images deleted", results: deleteResults },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error);
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 }
    );
  }
};
