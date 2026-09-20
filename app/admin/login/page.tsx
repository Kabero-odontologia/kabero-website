"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import PasswordField from "@/components/admin/PasswordField";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

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
          <span className="text-headline-sm text-white/50">Panel de administración</span>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-title-lg font-medium text-white/60 tracking-wide">
              USUARIO O EMAIL
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:bg-white/[0.09] transition-colors"
              placeholder="admin"
            />
          </div>

          <PasswordField
            id="password"
            label="CONTRASEÑA"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />

          <Link
            href="/admin/olvide-password"
            className="text-title-lg text-white/45 hover:text-white/70 -mt-2 self-end transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          {state?.error && (
            <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
