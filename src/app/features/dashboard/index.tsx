"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Download,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  cashflowSelector,
  getCashflowSummaryAction,
  getCashflowTrendAction,
  setTimeRangeAction,
  triggerReconcileAction,
} from "@stores/reducers/cashflow";
import { formatVND } from "@commons/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function DashboardFeature() {
  const dispatch = useAppDispatch();
  const { summary, items: trendData, timeRange, isReconciling } =
    useAppSelector(cashflowSelector);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(getCashflowSummaryAction());
    dispatch(getCashflowTrendAction({ range: timeRange }));
  }, [dispatch, timeRange]);

  const handleTimeRangeChange = (range: "today" | "week" | "month") => {
    dispatch(setTimeRangeAction(range));
    dispatch(getCashflowTrendAction({ range }));
  };

  const handleReconcile = () => {
    dispatch(triggerReconcileAction());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header / Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-bold">
            <span className="text-indigo-600">Khối Vận hành Tài chính</span>
            <span className="text-slate-300">•</span>
            <span className="text-pink-600 font-bold flex items-center gap-1.5 bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block animate-ping" />
              LIVE REAL-TIME LEDGER
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tổng quan Dòng tiền Doanh nghiệp
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time range selector */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {(["today", "week", "month"] as const).map((range) => {
              const labelMap = {
                today: "Hôm nay",
                week: "Tuần này",
                month: "Tháng này",
              };
              const isSelected = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  {labelMap[range]}
                </button>
              );
            })}
          </div>

          {/* Vibrant RGB Reconcile Button */}
          <button
            onClick={handleReconcile}
            disabled={isReconciling}
            className="flex items-center gap-2 bg-gradient-rgb-cta text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            <RefreshCw
              className={`w-4 h-4 ${isReconciling ? "animate-spin" : ""}`}
            />
            <span>{isReconciling ? "Đang đối soát..." : "Đối soát tức thì"}</span>
          </button>

          <button
            title="Xuất dữ liệu Excel"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Tổng số dư khả dụng */}
        <div className="rgb-card-light rgb-border-gradient p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng số dư khả dụng
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatVND(summary?.totalAvailableBalance || 0)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2.4% so với hôm qua</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Hợp nhất từ 4 tài khoản ngân hàng chính thức
          </p>
        </div>

        {/* Card 2: Dòng tiền ròng Net Cash Flow */}
        <div className="rgb-card-light p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dòng tiền ròng (Net Flow)
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight tabular-nums">
              +{formatVND(summary?.netCashFlowToday || 0)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded-full border border-indigo-200/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dương thặng dư vận hành</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Lũy kế tháng: +{formatVND(summary?.netCashFlowMonth || 0)}
          </p>
        </div>

        {/* Card 3: Tổng thu thực nhận Inflow */}
        <div className="rgb-card-light p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Thu thực nhận (Inflow)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatVND(summary?.inflowMonth || 0)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.2% cùng kỳ tháng trước</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Chủ yếu từ kênh B2B và Cổng MoMo
          </p>
        </div>

        {/* Card 4: Tổng chi hoạt động Outflow */}
        <div className="rgb-card-light p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chi hoạt động (Burn Rate)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600 tracking-tight tabular-nums">
              {formatVND(summary?.outflowMonth || 0)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-600 bg-slate-100 w-fit px-2 py-0.5 rounded-full border border-slate-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Runway: {summary?.runwayDays || 245} ngày an toàn</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Đã bao gồm chi lương & hạ tầng Cloud
          </p>
        </div>
      </div>

      {/* Main Charts & Banks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cash Flow Trend Interactive Chart */}
        <div className="lg:col-span-2 rgb-card-light p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Biến động Dòng tiền Theo Thời gian Thực
              </h2>
              <p className="text-xs text-slate-500">
                So sánh thu vào (Inflow), chi ra (Outflow) và số dư lũy kế
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Thu vào
              </span>
              <span className="flex items-center gap-1.5 text-pink-500">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Chi ra
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${(val / 1e9).toFixed(0)} tỷ`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatVND(val), ""]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      borderColor: "#e2e8f0",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    name="Thu vào"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorInflow)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    name="Chi ra"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOutflow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right 1 Col: Synchronized Bank Accounts */}
        <div className="rgb-card-light p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Tài khoản Ngân hàng
              </h2>
              <p className="text-xs text-slate-500">Đồng bộ tự động qua API</p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              4 Tài khoản
            </span>
          </div>

          <div className="flex flex-col gap-3 my-3">
            {summary?.bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-indigo-700 shadow-sm">
                    {acc.bankCode}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {acc.bankName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {acc.accountNumber}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {formatVND(acc.balance)}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
            Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}
