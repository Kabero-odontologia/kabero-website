import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">
      <AdminSidebar username={session.username} />
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
