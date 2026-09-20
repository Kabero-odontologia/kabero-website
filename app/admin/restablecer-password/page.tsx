import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0B] px-5 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-white/[0.04] blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-white/[0.03] blur-[120px]"
      />

      <div className="relative w-full max-w-[400px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3 items-center text-center">
          <Image
            src="/logo.png"
            alt="Kabero"
            width={2214}
            height={412}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
          <span className="text-headline-sm text-white/50">Elegí una contraseña nueva</span>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 text-center">
              Este link no es válido. Pedí uno nuevo.
            </p>
            <Link
              href="/admin/olvide-password"
              className="inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5"
            >
              Pedir link de recuperación
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
