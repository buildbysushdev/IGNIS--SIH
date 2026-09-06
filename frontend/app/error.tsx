"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("IGNIS Frontend Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-lg font-bold text-slate-100">
          IGNIS Tactical Dashboard Refresh
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          {error.message || "A temporary client rendering anomaly occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs transition shadow-lg cursor-pointer"
        >
          ↻ Re-initialize Dashboard
        </button>
      </div>
    </div>
  );
}
