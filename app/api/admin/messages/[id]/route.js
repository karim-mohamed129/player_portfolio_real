import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { requireApiAdmin } from "@/lib/auth";
import { requireJsonRequest, safeErrorResponse } from "@/lib/security";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(String(id || ""));
}

export async function PATCH(request, { params }) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  const contentError = requireJsonRequest(request, 2_000).error;
  if (contentError) return contentError;

  try {
    const { id } = await params;
    if (!validateId(id)) return NextResponse.json({ error: "Invalid message id." }, { status: 400 });

    const { status } = await request.json();
    if (!["new", "read"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    await connectDB();
    const message = await Message.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
    if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
    await writeAuditLog({ request, admin, action: "message.status", target: String(id), status: "success", details: { newStatus: status } });
    return NextResponse.json({ message: JSON.parse(JSON.stringify(message)) });
  } catch (error) {
    return safeErrorResponse(error, "Message could not be updated.", 500);
  }
}

export async function DELETE(request, { params }) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const { id } = await params;
    if (!validateId(id)) return NextResponse.json({ error: "Invalid message id." }, { status: 400 });

    await connectDB();
    const message = await Message.findByIdAndDelete(id).lean();
    if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
    await writeAuditLog({ request, admin, action: "message.delete", target: String(id), status: "success", details: { subject: message.subject } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return safeErrorResponse(error, "Message could not be deleted.", 500);
  }
}
