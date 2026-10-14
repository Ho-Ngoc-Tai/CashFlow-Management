"use client";

import React, { useState } from "react";
import {
  Building2,
  ChevronDown,
  Search,
  Bell,
  LogOut,
  User,
  ExternalLink,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { authSelector, logoutAction } from "@stores/reducers/auth";

export function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] z-40 px-6 flex items-center justify-between gap-4">
      {/* RGB Accent Line */}
      <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400" />

      {/* Left section: Entity selector & Live Sync indicator */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-slate-800 transition-all shadow-sm">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold tracking-wide">
            {user?.companyName || "FlowSync Enterprise"} - VNĐ
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200/80 px-3 py-1 rounded-full shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-[11px] text-indigo-900 font-semibold tracking-wide">
            Đang đồng bộ tự động 24/7 - Vietcombank & MoMo
          </span>
        </div>
      </div>

      {/* Right section: Search, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 px-3 py-1.5 rounded-xl text-slate-500 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm giao dịch, đối tác, số tài khoản..."
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-56 font-normal"
          />
          <kbd className="bg-white border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded shadow-sm font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          title="Thông báo"
          className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899] animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-all text-left"
          >
            <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-cyan-400 shadow-sm">
              <img
                src={
                  user?.avatarUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhaDJyMO0A9nau9f62JLydrBkwmXZUsjer3CTU4F_CTGFASc2VLGrO77tmhqFY3n1RyCZm5ySe7dz8-Qtqyal7qc1KEF9ISq1petCrI_QPDRo72KUF1ZgYocXEzNe7z1hT1jALrDAS0k6eWnW4eYo5jEvAjFK4S675SxSzOiFfbKTaTThTA8LGhDXXqJrT6nXWGE-yWFvQ7cbmzXk3wKfYv4RZYxDc8WrGl4ZJdNKTx4qBf9DGNDt"
                }
                alt={user?.fullName || "Profile"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold leading-tight text-slate-900">
                {user?.fullName || "Trần Minh Anh"}
              </span>
              <span className="text-[11px] text-pink-600 font-semibold">
                {user?.role || "CFO"} • FlowSync
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tài khoản doanh nghiệp
                </p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user?.email || "minh.anh@flowsync.enterprise"}
                </p>
              </div>

              <div className="py-1">
                <a
                  href="#profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Hồ sơ Quản trị viên
                </a>
                <a
                  href="#portal"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  Cổng kết nối Open Banking
                </a>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
