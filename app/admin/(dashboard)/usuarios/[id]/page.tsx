import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AdminUserForm from "../AdminUserForm";
import { updateAdminUser } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, session] = await Promise.all([prisma.admin.findUnique({ where: { id } }), getSession()]);
  if (!admin) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Editar usuario</h1>
      <AdminUserForm
        action={updateAdminUser.bind(null, id)}
        initial={{ username: admin.username, email: admin.email }}
        isSelf={admin.id === session?.adminId}
      />
    </div>
  );
}
