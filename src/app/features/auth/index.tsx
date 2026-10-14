"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { authSelector, loginAction } from "@stores/reducers/auth";
import { CreditCard, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { LOADING_STATUS } from "@interfaces/base";

export function AuthFeature() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(authSelector);
  const [email, setEmail] = useState("minh.anh@flowsync.enterprise");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAction({ email, password }));
  };

  const isLoading = status === LOADING_STATUS.LOADING;

  return (
    <div className="rgb-card-light p-8 flex flex-col gap-6 shadow-2xl">
      {/* Brand logo */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative flex items-center justify-center p-[2px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-pink-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
          <div className="bg-white rounded-[14px] p-2.5 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
          FlowSync Enterprise
        </h1>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Nền tảng Vận hành Dòng tiền & Quản trị Ngân quỹ Cấp Ngân hàng
        </p>
      </div>

      {Boolean(error) && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {String(error)}
        </div>
      )}

      {/* Sign-in Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-slate-700">Email công việc</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten.ban@doanhnghiep.vn"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-700">Mật khẩu</label>
            <a href="#forgot" className="text-indigo-600 hover:underline text-[11px] font-semibold">
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-slate-600 text-[11px] font-medium">Ghi nhớ phiên đăng nhập</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-3 rounded-xl bg-gradient-rgb-cta text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Truy cập Hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Bảo mật 256-bit SSL & Open Banking OAuth2</span>
      </div>
    </div>
  );
}
