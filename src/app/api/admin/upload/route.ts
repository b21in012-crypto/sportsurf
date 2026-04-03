import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary env vars missing, falling back to local storage");
      // Fallback: local storage for dev environment
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), "public", "uploads");
      try { await mkdir(uploadDir, { recursive: true }); } catch {}
      const uniqueId = Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      const ext = file.name.split(".").pop();
      const fileName = `${uniqueId}.${ext}`;
      await writeFile(join(uploadDir, fileName), buffer);
      return NextResponse.json({ url: `/uploads/${fileName}` });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "sportsurf",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("CRITICAL UPLOAD ERROR:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
