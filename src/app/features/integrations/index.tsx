"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  integrationsSelector,
  getIntegrationsAction,
  triggerSyncAction,
} from "@stores/reducers/integrations";
import { formatDateTime } from "@commons/utils";
import {
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Plus,
  AlertCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export function IntegrationsFeature() {
  const dispatch = useAppDispatch();
  const { items, activeSyncingId } = useAppSelector(integrationsSelector);

  useEffect(() => {
    dispatch(getIntegrationsAction());
  }, [dispatch]);

  const handleSync = (id: string) => {
    dispatch(triggerSyncAction({ id }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào bộ nhớ tạm");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-bold">
            <span className="text-indigo-600">Open Banking & ERP</span>
            <span className="text-slate-300">•</span>
            <span>Tích hợp Tự động hóa Dữ liệu</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cấu hình Kết nối & Tích hợp API
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-gradient-rgb-cta text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-pink-500/25 transition-all transform hover:-translate-y-0.5">
          <Plus className="w-4 h-4" />
          <span>Thêm cổng kết nối Ngân hàng</span>
        </button>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((conn) => {
          const isSyncing = activeSyncingId === conn.id || conn.status === "SYNCING";
          const isConnected = conn.status === "CONNECTED";

          return (
            <div
              key={conn.id}
              className="rgb-card-light p-6 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center font-black text-sm text-indigo-700 shadow-sm">
                      {conn.provider.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {conn.displayName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {conn.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Lỗi kết nối
                    </span>
                  )}
                </div>

                <div className="py-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đồng bộ gần nhất:</span>
                    <span className="font-semibold text-slate-800">
                      {formatDateTime(conn.lastSync)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giao dịch trong ngày:</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {conn.dailyTransactionsCount} txs
                    </span>
                  </div>

                  {conn.errorDetail && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200/60 text-rose-700 text-[11px] leading-relaxed">
                      {conn.errorDetail}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSync(conn.id)}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-indigo-600" : ""}`} />
                  <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}</span>
                </button>

                <button
                  onClick={() => toast.info(`Mở bảng cấu hình tham số cho ${conn.displayName}`)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                  <span>Cấu hình API</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook & Security Panel */}
      <div className="rgb-card-light p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Webhook Inbound Endpoints (Nhận dữ liệu thời gian thực từ Ngân hàng)</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Giao thức ngân hàng số Open Banking sẽ tự động gửi thông báo IPN (Instant Payment Notification)
          tới URL an toàn bên dưới khi có biến động số dư.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 select-all">
            https://api.flowsync.enterprise/v1/webhooks/banking/instant-settlement
          </div>
          <button
            onClick={() =>
              copyToClipboard(
                "https://api.flowsync.enterprise/v1/webhooks/banking/instant-settlement"
              )
            }
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>Sao chép URL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
