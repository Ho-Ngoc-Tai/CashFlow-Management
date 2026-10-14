import React from "react";
import { AuthFeature } from "@features/auth";

export const metadata = {
  title: "Đăng nhập | FlowSync Treasury Ops",
  description: "Đăng nhập hệ thống quản lý dòng tiền doanh nghiệp FlowSync",
};

export default function SignInPage() {
  return <AuthFeature />;
}
