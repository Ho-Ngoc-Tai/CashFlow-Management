import React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f8faff] text-[#0f172a] selection:bg-pink-100 selection:text-pink-600 p-4">
      {/* Subtle Light RGB Mesh Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-200/40 via-pink-200/30 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-cyan-200/40 via-purple-100/30 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f115_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
