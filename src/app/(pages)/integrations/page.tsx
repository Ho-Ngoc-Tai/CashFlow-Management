import React from "react";
import { IntegrationsFeature } from "@features/integrations";

export const metadata = {
  title: "Cấu hình Kết nối & Tích hợp API | FlowSync Treasury Ops",
  description: "Quản lý cổng kết nối Open Banking, ERP và Webhooks",
};

export default function IntegrationsPage() {
  return <IntegrationsFeature />;
}
