import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/db";
import { createAdminToken, ensureFirstAdmin, setAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await ensureFirstAdmin();
    await connectDB();

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim(), active: true });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = await createAdminToken(admin);
    const response = NextResponse.json({ ok: true, admin: { email: admin.email, name: admin.name, role: admin.role } });
    return setAuthCookie(response, token);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
