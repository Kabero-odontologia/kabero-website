import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import DeleteAdminButton from "./DeleteAdminButton";
import CreateAdminForm from "./CreateAdminForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function UsuariosPage() {
  const [admins, session] = await Promise.all([
    prisma.admin.findMany({ orderBy: { createdAt: "asc" } }),
    getSession(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Usuarios</h1>
        <p className="text-headline-sm text-white/45 mt-1">
          Quién puede entrar al admin. Cada persona con su propio usuario y contraseña.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {admins.map((admin) => {
              const isSelf = admin.id === session?.adminId;
              return (
                <div
                  key={admin.id}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col">
                    <span className="text-headline-sm font-medium text-white">
                      {admin.username}
                      {isSelf && <span className="text-white/40 font-normal"> (vos)</span>}
                    </span>
                    <span className="text-title-md text-white/40">
                      {admin.email ? `${admin.email} · ` : ""}Creado el {admin.createdAt.toLocaleDateString("es-BO")}
                    </span>
                  </div>
                  {!isSelf && admins.length > 1 && <DeleteAdminButton id={admin.id} username={admin.username} />}
                </div>
              );
            })}
          </div>

          <ChangePasswordForm />
        </div>

        <div className="lg:col-span-2">
          <CreateAdminForm />
        </div>
      </div>
    </div>
  );
}
