"use client";

import { useEffect, useState } from "react";

interface SavedToastProps {
  // Pass the useActionState `state` object itself (not just the boolean) — it's a
  // fresh object reference every time the action resolves, so the toast re-fires
  // even on back-to-back saves that both succeed.
  state: { success?: boolean };
}

export default function SavedToast({ state }: SavedToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.success) return;
    // Syncs the toast's visibility from the action's result — a fresh `state`
    // object every time the action resolves, so this re-fires on repeat saves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timeout);
  }, [state]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-500/15 backdrop-blur-xl border border-green-400/30 rounded-md px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-green-500/25 text-green-400 flex items-center justify-center text-title-lg shrink-0">
        ✓
      </span>
      <span className="text-headline-sm font-medium text-white">Cambios guardados</span>
    </div>
  );
}
