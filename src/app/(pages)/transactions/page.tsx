import React from "react";
import { TransactionsFeature } from "@features/transactions";

export const metadata = {
  title: "Sổ Chi tiết Giao dịch | FlowSync Treasury Ops",
  description: "Nhật ký thu chi và đối soát giao dịch đa ngân hàng tự động",
};

export default function TransactionsPage() {
  return <TransactionsFeature />;
}
