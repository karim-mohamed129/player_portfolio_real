import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { requireApiAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!["new", "read"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    await connectDB();
    const message = await Message.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
    return NextResponse.json({ message: JSON.parse(JSON.stringify(message)) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const { id } = await params;
    await connectDB();
    const message = await Message.findByIdAndDelete(id).lean();
    if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
