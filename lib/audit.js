import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { getClientIp } from "@/lib/security";

export async function writeAuditLog({ request, admin, action, target = "system", status = "success", details = {} }) {
  try {
    await connectDB();
    await AuditLog.create({
      adminEmail: admin?.email || "anonymous",
      adminId: admin?.id || null,
      action,
      target,
      status,
      details,
      ip: request ? getClientIp(request) : "unknown",
      userAgent: request?.headers?.get("user-agent")?.slice(0, 500) || ""
    });
  } catch (error) {
    console.error("[AuditLog write failed]", error);
  }
}
