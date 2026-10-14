"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  transactionsSelector,
  getTransactionsAction,
  filterTransactionsAction,
  reconcileTxAction,
  setSelectedTxAction,
} from "@stores/reducers/transactions";
import { Transaction } from "@interfaces/cashflow";
import { DataTable, Column } from "@components/modules/DataTable";
import { formatVND, formatDateTime } from "@commons/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from "lucide-react";

export function TransactionsFeature() {
  const dispatch = useAppDispatch();
  const { items, status, params, selectedTx } = useAppSelector(transactionsSelector);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceIdInput, setInvoiceIdInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTransactionsAction());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(filterTransactionsAction({ search: searchTerm }));
    dispatch(getTransactionsAction({ search: searchTerm }));
  };

  const handleDirectionFilter = (dir: "ALL" | "INFLOW" | "OUTFLOW") => {
    dispatch(filterTransactionsAction({ direction: dir }));
    dispatch(getTransactionsAction({ direction: dir }));
  };

  const handleStatusFilter = (st: "ALL" | "MATCHED" | "PENDING" | "REVIEW_REQUIRED") => {
    dispatch(filterTransactionsAction({ reconcileStatus: st }));
    dispatch(getTransactionsAction({ reconcileStatus: st }));
  };

  const openReconcileModal = (tx: Transaction) => {
    dispatch(setSelectedTxAction(tx));
    setInvoiceIdInput(tx.matchedInvoiceId || `INV-2026-AUTO-${Math.floor(Math.random() * 9000 + 1000)}`);
    setIsModalOpen(true);
  };

  const handleConfirmReconcile = () => {
    if (selectedTx && invoiceIdInput) {
      dispatch(reconcileTxAction({ txId: selectedTx.id, invoiceId: invoiceIdInput }));
      setIsModalOpen(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (params.direction && params.direction !== "ALL" && item.direction !== params.direction) {
      return false;
    }
    if (params.reconcileStatus && params.reconcileStatus !== "ALL" && item.reconcileStatus !== params.reconcileStatus) {
      return false;
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      return (
        item.txCode.toLowerCase().includes(q) ||
        item.counterpartyName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<Transaction>[] = [
    {
      key: "txCode",
      header: "Mã Giao dịch",
      render: (tx) => (
        <div>
          <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
            {tx.txCode}
          </span>
          <div className="text-[11px] text-slate-400 mt-1">{formatDateTime(tx.timestamp)}</div>
        </div>
      ),
    },
    {
      key: "bank",
      header: "Ngân hàng",
      render: (tx) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{tx.bankCode}</span>
          <div className="font-mono text-[11px] text-slate-400">{tx.accountNumber}</div>
        </div>
      ),
    },
    {
      key: "counterparty",
      header: "Đối tác / Mô tả",
      render: (tx) => (
        <div className="max-w-xs">
          <div className="font-semibold text-xs text-slate-900 truncate">{tx.counterpartyName}</div>
          <div className="text-[11px] text-slate-500 truncate">{tx.description}</div>
          {tx.matchedInvoiceId && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
              <FileCheck className="w-3 h-3" />
              {tx.matchedInvoiceId}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Số tiền (VNĐ)",
      align: "right",
      render: (tx) => {
        const isInflow = tx.direction === "INFLOW";
        return (
          <div className="text-right">
            <span
              className={`font-extrabold text-sm tabular-nums inline-flex items-center gap-1 ${
                isInflow ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isInflow ? (
                <ArrowDownLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5" />
              )}
              {isInflow ? "+" : "-"}
              {formatVND(tx.amount)}
            </span>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {tx.category}
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (tx) => {
        if (tx.reconcileStatus === "MATCHED") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã khớp
            </span>
          );
        }
        if (tx.reconcileStatus === "PENDING") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              Chờ đối soát
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Kiểm tra lại
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (tx) => (
        <div className="flex items-center justify-end gap-1.5">
          {tx.reconcileStatus !== "MATCHED" && (
            <button
              onClick={() => openReconcileModal(tx)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              Khớp ngay
            </button>
          )}
          <button
            onClick={() => openReconcileModal(tx)}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Chi tiết
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-bold">
            <span className="text-indigo-600">Sổ cái điện tử</span>
            <span className="text-slate-300">•</span>
            <span>Đồng bộ đa ngân hàng</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sổ Chi tiết Giao dịch & Đối soát
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất sao kê Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã GD, tên đối tác..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Direction Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {(["ALL", "INFLOW", "OUTFLOW"] as const).map((dir) => {
              const labelMap = { ALL: "Tất cả", INFLOW: "Thu vào", OUTFLOW: "Chi ra" };
              const isSelected = (params.direction || "ALL") === dir;
              return (
                <button
                  key={dir}
                  onClick={() => handleDirectionFilter(dir)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    isSelected ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                  }`}
                >
                  {labelMap[dir]}
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {(["ALL", "MATCHED", "PENDING", "REVIEW_REQUIRED"] as const).map((st) => {
              const labelMap = {
                ALL: "Tất cả trạng thái",
                MATCHED: "Đã khớp",
                PENDING: "Chờ khớp",
                REVIEW_REQUIRED: "Cần kiểm tra",
              };
              const isSelected = (params.reconcileStatus || "ALL") === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    isSelected ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                  }`}
                >
                  {labelMap[st]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable<Transaction>
        columns={columns}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        isLoading={status === "loading"}
        emptyMessage="Không tìm thấy giao dịch nào phù hợp với bộ lọc."
      />

      {/* Reconcile Modal */}
      {isModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>Khớp Đối Soát Hóa Đơn Doanh Nghiệp</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã giao dịch:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTx.txCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đối tác:</span>
                  <span className="font-bold text-slate-800">{selectedTx.counterpartyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-extrabold text-sm text-indigo-700 tabular-nums">
                    {formatVND(selectedTx.amount)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Mã hóa đơn / Mã hợp đồng đối chiếu:</label>
                <input
                  type="text"
                  value={invoiceIdInput}
                  onChange={(e) => setInvoiceIdInput(e.target.value)}
                  placeholder="Ví dụ: INV-2026-10-091"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200/60"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReconcile}
                className="px-5 py-2 rounded-xl font-bold bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
              >
                Xác nhận Khớp Đối Soát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
