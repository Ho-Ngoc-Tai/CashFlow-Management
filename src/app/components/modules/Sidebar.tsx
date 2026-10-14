"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@commons/utils";
import {
  DASHBOARD_PAGE,
  TRANSACTIONS_PAGE,
  INTEGRATIONS_PAGE,
  REPORTS_PAGE,
  HOME_PAGE,
} from "@routes/web";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  activePaths: string[];
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "Tổng quan",
      href: DASHBOARD_PAGE,
      icon: LayoutDashboard,
      activePaths: [HOME_PAGE, DASHBOARD_PAGE],
    },
    {
      name: "Sổ Giao dịch",
      href: TRANSACTIONS_PAGE,
      icon: ReceiptText,
      badge: "Tự động",
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-600",
      activePaths: [TRANSACTIONS_PAGE],
    },
    {
      name: "Cấu hình kết nối",
      href: INTEGRATIONS_PAGE,
      icon: SlidersHorizontal,
      activePaths: [INTEGRATIONS_PAGE],
    },
    {
      name: "Báo cáo & Phân tích",
      href: REPORTS_PAGE,
      icon: TrendingUp,
      activePaths: [REPORTS_PAGE],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-[4px_0_24px_rgba(99,102,241,0.05)] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 relative">
          <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400" />
          
          <div className="relative flex items-center justify-center p-[1.5px] rounded-xl bg-gradient-to-tr from-indigo-500 via-pink-500 to-cyan-400 shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
            <div className="bg-white rounded-[10px] p-1.5 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
              FlowSync
            </span>
            <span className="text-[10px] text-indigo-600 tracking-widest uppercase font-bold">
              TREASURY OPS 2.0
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-4">
          <div className="px-3 py-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Điều hướng chính
          </div>

          <nav className="flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = item.activePaths.includes(pathname);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_4px_16px_rgba(99,102,241,0.35)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent hover:border-slate-200/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-cyan-200"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse" />
                  )}

                  {!isActive && item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold border shadow-sm",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Bank-Grade Security Card */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 border border-indigo-100 shadow-sm flex flex-col gap-1.5 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-cyan-200/40 rounded-full blur-xl group-hover:scale-125 transition-all" />
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          <span className="tracking-wide">Bảo mật Cấp Ngân hàng</span>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          Mã hóa luồng dữ liệu 256-bit SSL trực tiếp từ cổng Open Banking.
        </p>
      </div>
    </aside>
  );
}
