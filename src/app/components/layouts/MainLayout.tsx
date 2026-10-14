"use client";

import React from "react";
import { Sidebar } from "@components/modules/Sidebar";
import { Header } from "@components/modules/Header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f8faff] text-[#0f172a] selection:bg-pink-100 selection:text-pink-600">
      {/* Subtle Light RGB Mesh Aura in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-200/30 via-pink-200/20 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-cyan-200/30 via-blue-100/20 to-transparent blur-[110px]" />
        <div className="absolute -bottom-[15%] left-[25%] w-[50vw] h-[45vw] rounded-full bg-gradient-to-tr from-pink-200/25 via-emerald-100/20 to-transparent blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f112_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64 relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="relative pt-20 pb-12 w-full flex-1">
          <div className="max-w-[1600px] mx-auto w-full px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
