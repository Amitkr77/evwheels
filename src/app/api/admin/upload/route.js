import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAdmin } from "@/lib/adminAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Whitelisted server-side so clients can't write into arbitrary Cloudinary folders.
const FOLDERS = {
  segment: "evwheels/segments",
  category: "evwheels/categories",
  categoryIcon: "evwheels/category-icons",
  subcategory: "evwheels/subcategories",
  product: "evwheels/products",
  banner: "evwheels/banners",
};

export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type");

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const folder = FOLDERS[type] || FOLDERS.product;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: "image" },
          (err, res) => (err ? reject(err) : resolve(res))
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("[admin/upload] POST", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Cleans up an asset that was uploaded but never ended up attached to a saved
// entity (form cancelled, image swapped out before saving, etc.) — without
// this, every discarded upload sits in Cloudinary forever.
export async function DELETE(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { publicId } = await req.json();
    if (!publicId)
      return NextResponse.json({ error: "publicId is required" }, { status: 400 });

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/upload] DELETE", error.message);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
