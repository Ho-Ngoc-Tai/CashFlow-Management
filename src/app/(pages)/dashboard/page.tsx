import React from "react";
import { DashboardFeature } from "@features/dashboard";

export const metadata = {
  title: "Tổng quan Dòng tiền | FlowSync Treasury Ops",
  description: "Bảng điều khiển tổng quan dòng tiền doanh nghiệp thời gian thực",
};

export default function DashboardPage() {
  return <DashboardFeature />;
}
