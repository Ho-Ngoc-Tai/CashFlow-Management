"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { authSelector, getUserInfoAction } from "@stores/reducers/auth";
import { LOADING_STATUS } from "@interfaces/base";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status, user } = useAppSelector(authSelector);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    dispatch(getUserInfoAction());
    const timer = setTimeout(() => setHasChecked(true), 300);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Loading overlay only for initial cold boot
  if (!hasChecked && status === LOADING_STATUS.LOADING && !user) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
        <div className="relative flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-pink-500 to-cyan-400 p-[2px] shadow-xl">
          <div className="bg-white rounded-[14px] p-4 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-xs tracking-wider uppercase text-slate-600">
              FlowSync Treasury Ops
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
