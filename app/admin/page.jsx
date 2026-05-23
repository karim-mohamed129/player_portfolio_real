import { redirect } from "next/navigation";
import { getCurrentAdminFromCookies } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdminFromCookies();
  if (!admin) redirect("/admin/login");
  return <AdminDashboard admin={admin} />;
}
