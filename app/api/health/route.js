import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    JWT_SECRET: Boolean(process.env.JWT_SECRET || process.env.AUTH_SECRET),
    ADMIN_EMAIL: Boolean(process.env.ADMIN_EMAIL),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
    CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET)
  };

  let mongo = "not_checked";
  try {
    await connectDB();
    mongo = "connected";
  } catch (error) {
    mongo = error.message;
  }

  return NextResponse.json({ ok: true, env, mongo });
}
